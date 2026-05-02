import { ArrowRight, ClipboardList } from 'lucide-react'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'
import { formatUserRef } from '../../lib/helpers'

export default function RecentTasks({
  tasks,
  userMap,
  onView,
  loading,
  blocked,
}) {
  if (blocked) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Recent tasks</h3>
        <p className="mt-2 text-sm text-gray-500">
          Load tasks from the API to see recent activity.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Recent tasks</h3>
          <p className="text-sm text-gray-500">Latest from the task list</p>
        </div>
      </div>
      {loading ? (
        <p className="px-6 py-8 text-sm text-gray-500">Loading…</p>
      ) : !tasks?.length ? (
        <p className="px-6 py-8 text-sm text-gray-500">No tasks to show.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{t.title}</p>
                <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                  {t.description}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Assigned: {formatUserRef(userMap, t.assigned_by)} · By:{' '}
                  {formatUserRef(userMap, t.created_by)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={t.status} />
                <Button
                  type="button"
                  variant="outline"
                  className="!px-3"
                  onClick={() => onView(t.id)}
                >
                  View
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && tasks?.length ? (
        <div className="border-t border-gray-100 px-6 py-3 text-xs text-gray-400">
          <ClipboardList className="mr-1 inline h-3.5 w-3.5" />
          Open the tasks page for the full list and filters.
        </div>
      ) : null}
    </div>
  )
}
