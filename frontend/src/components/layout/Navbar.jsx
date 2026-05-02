import {
  Menu,
  RefreshCw,
  Wifi,
  WifiOff,
  ShieldAlert,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react'
import Button from '../common/Button'
import { PAGE_KEYS } from '../../config/constants'

const titles = {
  [PAGE_KEYS.LOGIN]: 'Sign in',
  [PAGE_KEYS.SIGNUP]: 'Sign up',
  [PAGE_KEYS.DASHBOARD]: 'Dashboard',
  [PAGE_KEYS.TASKS]: 'Tasks',
  [PAGE_KEYS.TASK_DETAIL]: 'Task details',
  [PAGE_KEYS.CREATE_TASK]: 'Create task',
  [PAGE_KEYS.USERS]: 'Users',
  [PAGE_KEYS.REPORTS]: 'Reports',
  [PAGE_KEYS.PROFILE]: 'Profile',
  [PAGE_KEYS.FORBIDDEN]: 'Access denied',
  [PAGE_KEYS.API_BLOCKED]: 'API notes',
}

function AuthBadge({ hint }) {
  if (hint === 'authenticated') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100">
        <Wifi className="h-3.5 w-3.5" />
        Backend reachable
      </span>
    )
  }
  if (hint === 'unauthenticated') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-100">
        <ShieldAlert className="h-3.5 w-3.5" />
        Auth required (401)
      </span>
    )
  }
  if (hint === 'forbidden') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-800 ring-1 ring-red-100">
        Forbidden (403)
      </span>
    )
  }
  if (hint === 'unreachable') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
        <WifiOff className="h-3.5 w-3.5" />
        Backend unreachable
      </span>
    )
  }
  if (hint === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
        API error
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-100">
      Waiting for API
    </span>
  )
}

export default function Navbar({
  activePage,
  onOpenMobileNav,
  onRefresh,
  backendAuthHint,
  isLoggedIn,
  sessionUsername,
  onLogin,
  onSignUp,
  onLogout,
}) {
  const title = titles[activePage] || 'WorkSphere'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="truncate text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {sessionUsername ? (
          <span className="hidden max-w-[140px] truncate text-xs text-gray-500 sm:inline">
            {sessionUsername}
          </span>
        ) : null}
        <AuthBadge hint={backendAuthHint} />
        {isLoggedIn ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
            <Button
              type="button"
              variant="outline"
              className="sm:hidden"
              onClick={onLogout}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              className="hidden sm:inline-flex"
              onClick={onSignUp}
            >
              Sign up
            </Button>
            <Button
              type="button"
              variant="primary"
              className="hidden sm:inline-flex"
              onClick={onLogin}
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="sm:hidden"
              onClick={onSignUp}
              aria-label="Sign up"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="primary"
              className="sm:hidden"
              onClick={onLogin}
              aria-label="Sign in"
            >
              <LogIn className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="secondary"
          className="hidden sm:inline-flex"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh data
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="sm:hidden"
          onClick={onRefresh}
          aria-label="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
