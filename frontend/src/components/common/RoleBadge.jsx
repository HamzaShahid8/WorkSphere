const styles = {
  admin: 'bg-violet-50 text-violet-800 ring-violet-100',
  manager: 'bg-sky-50 text-sky-800 ring-sky-100',
  employee: 'bg-teal-50 text-teal-800 ring-teal-100',
}

const labels = {
  admin: 'Admin',
  manager: 'Manager',
  employee: 'Employee',
}

export default function RoleBadge({ role }) {
  const key = role || ''
  const cls = styles[key] || 'bg-gray-50 text-gray-700 ring-gray-100'
  const label = labels[key] || role || '—'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {label}
    </span>
  )
}
