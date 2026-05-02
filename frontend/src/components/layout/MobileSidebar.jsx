import { X } from 'lucide-react'
import {
  BarChart3,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  User,
  Users,
} from 'lucide-react'
import { getSidebarNav } from '../../config/navigation'
const icons = {
  'layout-dashboard': LayoutDashboard,
  'list-checks': ListChecks,
  users: Users,
  'bar-chart-3': BarChart3,
  user: User,
  'plus-circle': PlusCircle,
}

export default function MobileSidebar({
  open,
  onClose,
  uiPreviewRole,
  activePage,
  onNavigate,
}) {
  if (!open) return null

  const items = getSidebarNav(uiPreviewRole)

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/50"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-gray-200 bg-white shadow-xl">
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
          <span className="font-semibold text-gray-900">WorkSphere</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {items.map((item) => {
            const Icon = icons[item.icon] || LayoutDashboard
            const isActive = activePage === item.pageKey
            return (
              <button
                key={item.pageKey}
                type="button"
                onClick={() => {
                  onNavigate(item.pageKey)
                  onClose()
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
