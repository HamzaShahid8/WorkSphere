import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const COLORS = {
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  completed: '#10b981',
}

const LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export default function TaskStatusChart({ summary, loading, blocked }) {
  if (blocked) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
        Chart unavailable without task summary data.
      </div>
    )
  }

  const data = ['pending', 'in_progress', 'completed'].map((key) => ({
    name: LABELS[key],
    key,
    value: loading ? 0 : Number(summary?.[key]) || 0,
  }))

  const hasData = data.some((d) => d.value > 0)

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Tasks by status</h3>
      <p className="mt-1 text-sm text-gray-500">Distribution from task summary</p>
      <div className="mt-6 h-72">
        {!hasData && !loading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No tasks yet for your scope.
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
                  <Cell
                    key={entry.key}
                    fill={COLORS[entry.key] || '#94a3b8'}
                  />
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
