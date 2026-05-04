import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { formatStatusKey, getSummaryMetricEntries } from '../../lib/helpers'

const CHART_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
]

export default function TaskStatusChart({ summary, loading, blocked }) {
  if (blocked) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
        Chart unavailable without task summary data.
      </div>
    )
  }

  const metrics = getSummaryMetricEntries(summary)
  const data = metrics.map((metric, idx) => ({
    name: formatStatusKey(metric.key),
    key: metric.key,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    value: loading ? 0 : metric.value,
  }))

  const hasData = data.some((d) => d.value > 0)

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Dashboard metrics</h3>
      <p className="mt-1 text-sm text-gray-500">Distribution from dashboard summary</p>
      <div className="mt-6 h-72">
        {!hasData && !loading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No metric data available for your scope.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={96}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
