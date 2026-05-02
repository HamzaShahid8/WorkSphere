const styles = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-100',
  in_progress: 'bg-blue-50 text-blue-800 ring-blue-100',
  completed: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
}

const labels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export default function StatusBadge({ status }) {
  const key = status || ''
  const cls = styles[key] || 'bg-gray-50 text-gray-700 ring-gray-100'
  const label = labels[key] || status || 'Unknown'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {label}
    </span>
  )
}
