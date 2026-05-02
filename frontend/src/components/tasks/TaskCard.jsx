import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'
import { formatDate, formatUserRef } from '../../lib/helpers'

export default function TaskCard({ task, userMap, onViewDetails }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{task.description}</p>
      <dl className="mt-4 space-y-1 text-xs text-gray-500">
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-gray-400">Assigned user</dt>
          <dd className="text-right text-gray-700">
            {formatUserRef(userMap, task.assigned_by)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-gray-400">Created by</dt>
          <dd className="text-right text-gray-700">
            {formatUserRef(userMap, task.created_by)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-gray-400">Created at</dt>
          <dd className="text-right">{formatDate(task.created_at)}</dd>
        </div>
      </dl>
      <Button
        type="button"
        variant="primary"
        className="mt-4 w-full"
        onClick={() => onViewDetails(task.id)}
      >
        View details
      </Button>
    </div>
  )
}
