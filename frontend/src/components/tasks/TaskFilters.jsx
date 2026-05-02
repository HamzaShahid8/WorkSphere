import { Search } from 'lucide-react'
import Input from '../common/Input'
import Select from '../common/Select'
import { TASK_STATUSES } from '../../config/constants'

const statusOptions = [
  { value: '', label: 'All statuses' },
  ...TASK_STATUSES.map((s) => ({ value: s.value, label: s.label })),
]

export default function TaskFilters({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          label=""
          id="task-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title or description"
          className="pl-9"
          aria-label="Search tasks"
        />
      </div>
      <div className="sm:w-48">
        <Select
          label="Status"
          value={status}
          options={statusOptions}
          onChange={(e) => onStatusChange(e.target.value)}
        />
      </div>
    </div>
  )
}
