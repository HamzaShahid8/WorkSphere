import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/common/PageHeader'
import TaskForm from '../components/tasks/TaskForm'
import ApiBlocked from '../components/common/ApiBlocked'
import Loader from '../components/common/Loader'
import { PAGE_KEYS } from '../config/constants'
import { useAppState } from '../state/appState'
import * as userService from '../services/userService'
import * as taskService from '../services/taskService'
import { isUnauthorizedError } from '../lib/api'
import { normalizeListResponse } from '../lib/helpers'

const initial = {
  title: '',
  description: '',
  assigned_by: '',
  status: 'pending',
}

export default function CreateTaskPage() {
  const {
    triggerRefresh,
    setActivePage,
    refreshNonce,
    setAuthHintFromError,
  } = useAppState()

  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [userOptions, setUserOptions] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersBlocked, setUsersBlocked] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      setUsersLoading(true)
      setUsersBlocked(false)
      try {
        const data = await userService.getUsers()
        if (cancelled) return
        const list = normalizeListResponse(data)
        setUserOptions(
          list.map((u) => ({
            value: String(u.id),
            label: `${u.username} (${u.role})`,
          })),
        )
      } catch (e) {
        if (isUnauthorizedError(e)) {
          setUsersBlocked(true)
          setUserOptions([])
          setAuthHintFromError(e)
        } else {
          setAuthHintFromError(e)
          toast.error(e.message)
        }
      } finally {
        if (!cancelled) setUsersLoading(false)
      }
    }

    loadUsers()
    return () => {
      cancelled = true
    }
  }, [refreshNonce, setAuthHintFromError])

  const onChange = (field, v) => {
    setValues((prev) => ({ ...prev, [field]: v }))
  }

  const validate = () => {
    const next = {}
    if (!values.title.trim()) next.title = 'Title is required.'
    if (!values.description.trim()) next.description = 'Description is required.'
    if (!values.assigned_by) next.assigned_by = 'Assigned user is required.'
    if (!values.status) next.status = 'Status is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    if (usersBlocked || userOptions.length === 0) {
      toast.error('Cannot submit without assignee options from the API.')
      return
    }
    setSubmitting(true)
    try {
      await taskService.createTask({
        title: values.title.trim(),
        description: values.description.trim(),
        assigned_by: Number(values.assigned_by),
        status: values.status,
      })
      toast.success('Task created.')
      setValues(initial)
      triggerRefresh()
      setActivePage(PAGE_KEYS.TASKS)
    } catch (e) {
      toast.error(e.message || 'Could not create task.')
      setAuthHintFromError(e)
    } finally {
      setSubmitting(false)
    }
  }

  if (usersLoading) {
    return <Loader label="Loading users for assignment…" />
  }

  if (usersBlocked) {
    return (
      <div>
        <PageHeader
          title="Create task"
          subtitle="POST /api/task/ — requires manager permissions on the backend"
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
        title="Create task"
        subtitle="Submit a new task with assignee and status. Payload uses backend field assigned_by."
      />
      <TaskForm
        values={values}
        errors={errors}
        onChange={onChange}
        userOptions={userOptions}
        usersBlocked={usersBlocked}
        submitting={submitting}
        onSubmit={onSubmit}
      />
    </div>
  )
}
