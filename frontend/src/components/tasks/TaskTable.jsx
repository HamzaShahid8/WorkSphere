import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'
import { formatDate, formatUserRef } from '../../lib/helpers'

export default function TaskTable({ tasks, userMap, onViewDetails }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Assigned user</th>
            <th className="px-4 py-3">Created by</th>
            <th className="px-4 py-3">Created at</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50/80">
              <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-900">
                {t.title}
              </td>
              <td className="max-w-[280px] truncate px-4 py-3 text-gray-600">
                {t.description}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {formatUserRef(userMap, t.assigned_by)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {formatUserRef(userMap, t.created_by)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {formatDate(t.created_at)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  type="button"
                  variant="outline"
                  className="!px-3 !py-1.5 text-xs"
                  onClick={() => onViewDetails(t.id)}
                >
                  View details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
