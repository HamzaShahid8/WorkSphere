import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskTable from '../components/tasks/TaskTable'
import TaskCard from '../components/tasks/TaskCard'
import ApiBlocked from '../components/common/ApiBlocked'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import ErrorMessage from '../components/common/ErrorMessage'
import { ClipboardList } from 'lucide-react'
import { useAppState } from '../state/appState'
import * as taskService from '../services/taskService'
import * as userService from '../services/userService'
import { isUnauthorizedError } from '../lib/api'
import { buildUserMap, normalizeListResponse } from '../lib/helpers'
import { PAGE_KEYS } from '../config/constants'
import { tasksPageTitle } from '../config/navigation'

function matchesSearch(task, q) {
  if (!q.trim()) return true
  const s = q.toLowerCase()
  return (
    String(task.title || '')
      .toLowerCase()
      .includes(s) ||
    String(task.description || '')
      .toLowerCase()
      .includes(s)
  )
}

export default function TasksPage() {
  const {
    refreshNonce,
    triggerRefresh,
    uiPreviewRole,
    setActivePage,
    setSelectedTaskId,
    setAuthHintFromError,
    markAuthOk,
  } = useAppState()

  const [loading, setLoading] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [tasks, setTasks] = useState([])
  const [userMap, setUserMap] = useState({})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setBlocked(false)
      setFetchError(null)
      try {
        const data = await taskService.getTasks()
        if (cancelled) return
        markAuthOk()
        setTasks(normalizeListResponse(data))

        try {
          const usersRaw = await userService.getUsers()
          if (cancelled) return
          setUserMap(buildUserMap(normalizeListResponse(usersRaw)))
        } catch (e) {
          if (!isUnauthorizedError(e)) setFetchError(e.message)
          setAuthHintFromError(e)
        }
      } catch (e) {
        if (isUnauthorizedError(e)) {
          setBlocked(true)
          setAuthHintFromError(e)
          setTasks([])
        } else {
          setFetchError(e.message)
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

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (status && t.status !== status) return false
      return matchesSearch(t, search)
    })
  }, [tasks, search, status])

  const openDetail = (id) => {
    setSelectedTaskId(id)
    setActivePage(PAGE_KEYS.TASK_DETAIL)
  }

  if (loading && !tasks.length && !blocked) {
    return <Loader label="Loading tasks…" />
  }

  if (blocked) {
    return (
      <div>
        <PageHeader
          title={tasksPageTitle(uiPreviewRole)}
          subtitle="Tasks returned by the backend for the authenticated user"
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
        title={tasksPageTitle(uiPreviewRole)}
        subtitle="Search and filter tasks from the API"
      />

      {fetchError ? (
        <div className="mb-4">
          <ErrorMessage
            title="Partial load issue"
            message={fetchError}
          />
        </div>
      ) : null}

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {loading ? <Loader label="Refreshing tasks…" /> : null}

      {!loading && !filtered.length ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks match your filters"
          description="Try clearing search or status, or create a task if you have API access."
        />
      ) : (
        <>
          <TaskTable
            tasks={filtered}
            userMap={userMap}
            onViewDetails={openDetail}
          />
          <div className="mt-4 flex flex-col gap-4 md:hidden">
            {filtered.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                userMap={userMap}
                onViewDetails={openDetail}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
