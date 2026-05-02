import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/dashboard/StatCard'
import TaskStatusChart from '../components/dashboard/TaskStatusChart'
import RecentTasks from '../components/dashboard/RecentTasks'
import ApiBlocked from '../components/common/ApiBlocked'
import Loader from '../components/common/Loader'
import { PAGE_KEYS } from '../config/constants'
import { useAppState } from '../state/appState'
import * as taskService from '../services/taskService'
import * as userService from '../services/userService'
import { isUnauthorizedError } from '../lib/api'
import {
  buildUserMap,
  computeSummaryTotals,
  normalizeListResponse,
  sortTasksByCreatedAtDesc,
} from '../lib/helpers'

export default function DashboardPage() {
  const {
    refreshNonce,
    triggerRefresh,
    setAuthHintFromError,
    markAuthOk,
    setActivePage,
    setSelectedTaskId,
  } = useAppState()

  const [loading, setLoading] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const [summary, setSummary] = useState(null)
  const [tasks, setTasks] = useState([])
  const [userMap, setUserMap] = useState({})

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setBlocked(false)
      try {
        const [summaryData, taskData] = await Promise.all([
          taskService.getTaskSummary(),
          taskService.getTasks(),
        ])
        if (cancelled) return

        markAuthOk()
        setSummary(summaryData)
        const list = normalizeListResponse(taskData)
        setTasks(list)

        try {
          const usersRaw = await userService.getUsers()
          if (cancelled) return
          setUserMap(buildUserMap(normalizeListResponse(usersRaw)))
        } catch (e) {
          if (isUnauthorizedError(e)) {
            setAuthHintFromError(e)
          }
        }
      } catch (e) {
        if (isUnauthorizedError(e)) {
          setBlocked(true)
          setAuthHintFromError(e)
          setSummary(null)
          setTasks([])
        } else {
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

  const totals = useMemo(() => computeSummaryTotals(summary), [summary])
  const recent = useMemo(
    () => sortTasksByCreatedAtDesc(tasks).slice(0, 5),
    [tasks],
  )

  const onViewTask = (id) => {
    setSelectedTaskId(id)
    setActivePage(PAGE_KEYS.TASK_DETAIL)
  }

  if (loading && !summary && !blocked) {
    return <Loader label="Loading dashboard…" />
  }

  if (blocked) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle="Overview of tasks and status distribution"
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
        title="Dashboard"
        subtitle="Live metrics from the task API and summary endpoint"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total tasks"
          value={totals?.total}
          loading={loading}
          blocked={false}
        />
        <StatCard
          title="Pending"
          value={summary != null ? summary.pending : null}
          loading={loading}
          blocked={false}
        />
        <StatCard
          title="In progress"
          value={summary != null ? summary.in_progress : null}
          loading={loading}
          blocked={false}
        />
        <StatCard
          title="Completed"
          value={summary != null ? summary.completed : null}
          loading={loading}
          blocked={false}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskStatusChart
          summary={summary}
          loading={loading}
          blocked={false}
        />
        <RecentTasks
          tasks={recent}
          userMap={userMap}
          onView={onViewTask}
          loading={loading}
          blocked={false}
        />
      </div>
    </div>
  )
}
