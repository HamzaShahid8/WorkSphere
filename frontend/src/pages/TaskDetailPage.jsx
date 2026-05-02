import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import Select from '../components/common/Select'
import StatusBadge from '../components/common/StatusBadge'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import ApiBlocked from '../components/common/ApiBlocked'
import { useAppState } from '../state/appState'
import * as taskService from '../services/taskService'
import * as userService from '../services/userService'
import { isUnauthorizedError } from '../lib/api'
import { formatDate, formatUserRef, normalizeListResponse, buildUserMap } from '../lib/helpers'
import { PAGE_KEYS, TASK_STATUSES } from '../config/constants'

export default function TaskDetailPage() {
  const {
    selectedTaskId,
    setActivePage,
    triggerRefresh,
    setAuthHintFromError,
    markAuthOk,
  } = useAppState()

  const [loading, setLoading] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const [task, setTask] = useState(null)
  const [error, setError] = useState(null)
  const [userMap, setUserMap] = useState({})
  const [statusEdit, setStatusEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!selectedTaskId) {
        setError('No task selected.')
        setLoading(false)
        return
      }
      setLoading(true)
      setBlocked(false)
      setError(null)
      try {
        const t = await taskService.getTaskById(selectedTaskId)
        if (cancelled) return
        markAuthOk()
        setTask(t)
        setStatusEdit(t.status || '')

        try {
          const usersRaw = await userService.getUsers()
          if (cancelled) return
          setUserMap(buildUserMap(normalizeListResponse(usersRaw)))
        } catch (e) {
          setAuthHintFromError(e)
        }
      } catch (e) {
        if (isUnauthorizedError(e)) {
          setBlocked(true)
          setAuthHintFromError(e)
        } else if (e?.code === 'NOT_FOUND') {
          setError('Task not found.')
        } else {
          setError(e.message)
          setAuthHintFromError(e)
        }
        setTask(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [selectedTaskId, markAuthOk, setAuthHintFromError])

  const statusOptions = TASK_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  const saveStatus = async () => {
    if (!task || statusEdit === task.status) return
    setSaving(true)
    try {
      const updated = await taskService.updateTask(task.id, {
        status: statusEdit,
      })
      setTask(updated)
      toast.success('Task status updated.')
      triggerRefresh()
    } catch (e) {
      toast.error(e.message || 'Failed to update task.')
      setAuthHintFromError(e)
    } finally {
      setSaving(false)
    }
  }

  const removeTask = async () => {
    if (!task) return
    if (!window.confirm('Delete this task? This cannot be undone.')) return
    setDeleting(true)
    try {
      await taskService.deleteTask(task.id)
      toast.success('Task deleted.')
      triggerRefresh()
      setActivePage(PAGE_KEYS.TASKS)
    } catch (e) {
      toast.error(e.message || 'Failed to delete task.')
      setAuthHintFromError(e)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <Loader label="Loading task…" />
  }

  if (blocked) {
    return (
      <div>
        <PageHeader title="Task details" subtitle="Read-only without API access" />
        <ApiBlocked
          onRetry={triggerRefresh}
          onViewNotes={() => setActivePage(PAGE_KEYS.API_BLOCKED)}
          onSignIn={() => setActivePage(PAGE_KEYS.LOGIN)}
          onSignUp={() => setActivePage(PAGE_KEYS.SIGNUP)}
        />
      </div>
    )
  }

  if (error || !task) {
    return (
      <div>
        <PageHeader title="Task details" />
        <ErrorMessage title="Unable to load task" message={error || 'Unknown error.'} />
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={() => setActivePage(PAGE_KEYS.TASKS)}
        >
          Back to tasks
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={task.title}
        subtitle="Details from GET /api/task/:id/"
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setActivePage(PAGE_KEYS.TASKS)}
          >
            Back to tasks
          </Button>
        }
      />

      <div className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">Description</p>
          <p className="mt-1 whitespace-pre-wrap text-gray-800">{task.description}</p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-400">
              Assigned user
            </dt>
            <dd className="mt-1 text-gray-900">
              {formatUserRef(userMap, task.assigned_by)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-400">Created by</dt>
            <dd className="mt-1 text-gray-900">
              {formatUserRef(userMap, task.created_by)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-400">Created at</dt>
            <dd className="mt-1 text-gray-900">{formatDate(task.created_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-400">Status</dt>
            <dd className="mt-1">
              <StatusBadge status={task.status} />
            </dd>
          </div>
        </dl>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-900">Update status</h3>
          <p className="mt-1 text-xs text-gray-500">
            Sends PATCH to /api/task/:id/ when supported by your account permissions.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="sm:w-56">
              <Select
                label="Status"
                value={statusEdit}
                options={statusOptions}
                onChange={(e) => setStatusEdit(e.target.value)}
                disabled={saving}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={saveStatus}
              disabled={saving || statusEdit === task.status}
            >
              {saving ? 'Saving…' : 'Save status'}
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-red-800">Danger zone</h3>
          <p className="mt-1 text-xs text-gray-500">
            DELETE /api/task/:id/ — requires permission from the backend.
          </p>
          <Button
            type="button"
            variant="danger"
            className="mt-3"
            onClick={removeTask}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete task'}
          </Button>
        </div>
      </div>
    </div>
  )
}
