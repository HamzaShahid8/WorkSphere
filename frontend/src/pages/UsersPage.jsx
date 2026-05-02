import { useEffect, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import UserTable from '../components/users/UserTable'
import ApiBlocked from '../components/common/ApiBlocked'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import ErrorMessage from '../components/common/ErrorMessage'
import { Users } from 'lucide-react'
import { PAGE_KEYS } from '../config/constants'
import { useAppState } from '../state/appState'
import * as userService from '../services/userService'
import { isUnauthorizedError } from '../lib/api'
import { normalizeListResponse } from '../lib/helpers'

export default function UsersPage() {
  const {
    refreshNonce,
    triggerRefresh,
    setAuthHintFromError,
    markAuthOk,
    setActivePage,
  } = useAppState()

  const [loading, setLoading] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setBlocked(false)
      setError(null)
      try {
        const data = await userService.getUsers()
        if (cancelled) return
        markAuthOk()
        setUsers(normalizeListResponse(data))
      } catch (e) {
        if (isUnauthorizedError(e)) {
          setBlocked(true)
          setAuthHintFromError(e)
          setUsers([])
        } else {
          setError(e.message)
          setAuthHintFromError(e)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [refreshNonce, markAuthOk, setAuthHintFromError])

  if (loading && !users.length && !blocked) {
    return <Loader label="Loading users…" />
  }

  if (blocked) {
    return (
      <div>
        <PageHeader
          title="Users"
          subtitle="GET /accounts/user/ — admin-scoped on the backend"
        />
        <ApiBlocked
          onRetry={triggerRefresh}
          onViewNotes={() => setActivePage(PAGE_KEYS.API_BLOCKED)}
          onSignIn={() => setActivePage(PAGE_KEYS.LOGIN)}
          onSignUp={() => setActivePage(PAGE_KEYS.SIGNUP)}
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Directory from the accounts API (passwords never shown)"
      />
      {error ? (
        <div className="mb-4">
          <ErrorMessage title="Could not refresh users" message={error} />
        </div>
      ) : null}
      {!loading && !users.length ? (
        <EmptyState
          icon={Users}
          title="No users returned"
          description="The API responded successfully but the list is empty."
        />
      ) : (
        <UserTable users={users} />
      )}
    </div>
  )
}
