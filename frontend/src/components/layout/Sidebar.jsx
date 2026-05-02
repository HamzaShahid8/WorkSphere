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

export default function Sidebar({
  uiPreviewRole,
  activePage,
  onNavigate,
  collapsed,
}) {
  const items = getSidebarNav(uiPreviewRole)

  return (
    <aside
      className={`hidden shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col ${
        collapsed ? 'lg:w-20' : 'lg:w-56'
      }`}
    >
      <div className="flex h-14 items-center border-b border-gray-100 px-4">
        <span className="truncate font-semibold tracking-tight text-gray-900">
          {collapsed ? 'WS' : 'WorkSphere'}
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const Icon = icons[item.icon] || LayoutDashboard
          const isActive = activePage === item.pageKey
          return (
            <button
              key={item.pageKey}
              type="button"
              onClick={() => onNavigate(item.pageKey)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
