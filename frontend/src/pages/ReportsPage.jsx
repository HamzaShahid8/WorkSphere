import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { PAGE_KEYS } from '../config/constants'
import PageHeader from '../components/common/PageHeader'
import ApiBlocked from '../components/common/ApiBlocked'
import Loader from '../components/common/Loader'
import StatCard from '../components/dashboard/StatCard'
import { useAppState } from '../state/appState'
import * as taskService from '../services/taskService'
import { isUnauthorizedError } from '../lib/api'
import { computeSummaryTotals } from '../lib/helpers'

const LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export default function ReportsPage() {
  const { refreshNonce, triggerRefresh, setAuthHintFromError, markAuthOk, setActivePage } =
    useAppState()

  const [loading, setLoading] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setBlocked(false)
      try {
        const data = await taskService.getTaskSummary()
        if (cancelled) return
        markAuthOk()
        setSummary(data)
      } catch (e) {
        if (isUnauthorizedError(e)) {
          setBlocked(true)
          setAuthHintFromError(e)
          setSummary(null)
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

  const chartData = useMemo(() => {
    if (!summary) return []
    return ['pending', 'in_progress', 'completed'].map((k) => ({
      name: LABELS[k],
      key: k,
      count: Number(summary[k]) || 0,
      pct:
        totals?.total
          ? ((Number(summary[k]) || 0) / totals.total) * 100
          : 0,
    }))
  }, [summary, totals])

  if (loading && !summary && !blocked) {
    return <Loader label="Loading reports…" />
  }

  if (blocked) {
    return (
      <div>
        <PageHeader
          title="Reports"
          subtitle="Built from GET /api/task/summary/"
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
        title="Reports"
        subtitle="Counts and distribution from the task summary endpoint"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={totals?.total} loading={loading} blocked={false} />
        <StatCard
          title="Pending"
          value={summary?.pending}
          loading={loading}
          blocked={false}
        />
        <StatCard
          title="In progress"
          value={summary?.in_progress}
          loading={loading}
          blocked={false}
        />
        <StatCard
          title="Completed"
          value={summary?.completed}
          loading={loading}
          blocked={false}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Percentage breakdown</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {chartData.map((row) => (
              <li
                key={row.key}
                className="flex items-center justify-between gap-4 border-b border-gray-50 pb-2 last:border-0"
              >
                <span className="font-medium text-gray-700">{row.name}</span>
                <span className="text-gray-600">
                  {row.count}{' '}
                  <span className="text-gray-400">
                    ({totals?.total ? row.pct.toFixed(1) : '0.0'}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Bar chart</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
