import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import MobileSidebar from '../components/layout/MobileSidebar'
import Select from '../components/common/Select'
import { UI_PREVIEW_ROLES, MSG_ROLE_PREVIEW_NOTE } from '../config/constants'

const roleOptions = UI_PREVIEW_ROLES.map((r) => ({
  value: r,
  label: r.charAt(0).toUpperCase() + r.slice(1),
}))

export default function DashboardLayout({
  children,
  activePage,
  setActivePage,
  uiPreviewRole,
  setUiPreviewRole,
  backendAuthHint,
  triggerRefresh,
  isLoggedIn,
  sessionUsername,
  onLogin,
  onSignUp,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        uiPreviewRole={uiPreviewRole}
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
      />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        uiPreviewRole={uiPreviewRole}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          activePage={activePage}
          onOpenMobileNav={() => setMobileOpen(true)}
          onRefresh={triggerRefresh}
          backendAuthHint={backendAuthHint}
          isLoggedIn={isLoggedIn}
          sessionUsername={sessionUsername}
          onLogin={onLogin}
          onSignUp={onSignUp}
          onLogout={onLogout}
        />
        <div className="border-b border-gray-100 bg-white px-4 py-3">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                UI role preview
              </p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="sm:w-56">
                  <Select
                    id="ui-preview-role"
                    label=""
                    value={uiPreviewRole}
                    options={roleOptions}
                    onChange={(e) => setUiPreviewRole(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500">{MSG_ROLE_PREVIEW_NOTE}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="hidden text-xs font-medium text-indigo-600 hover:text-indigo-800 lg:block"
            >
              {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </button>
          </div>
        </div>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
