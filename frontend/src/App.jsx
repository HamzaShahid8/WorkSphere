import { lazy, Suspense, useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import { AppStateProvider, useAppState } from './state/appState'
import DashboardLayout from './layouts/DashboardLayout'
import { canAccessPage } from './config/navigation'
import { PAGE_KEYS } from './config/constants'
import { getStoredUsername, hasAuthSession } from './lib/authStorage'
import Loader from './components/common/Loader'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TasksPage from './pages/TasksPage'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
import UsersPage from './pages/UsersPage'
import ProfilePage from './pages/ProfilePage'
import ForbiddenPage from './pages/ForbiddenPage'
import ApiBlockedPage from './pages/ApiBlockedPage'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))

function AppShell() {
  const {
    activePage,
    setActivePage,
    uiPreviewRole,
    setUiPreviewRole,
    backendAuthHint,
    triggerRefresh,
    authSessionVersion,
    logout,
  } = useAppState()

  const isLoggedIn = hasAuthSession()
  const sessionUsername = getStoredUsername()
  void authSessionVersion

  const content = useMemo(() => {
    if (activePage === PAGE_KEYS.LOGIN || activePage === PAGE_KEYS.SIGNUP)
      return null
    if (!canAccessPage(uiPreviewRole, activePage)) {
      return <ForbiddenPage />
    }

    switch (activePage) {
      case PAGE_KEYS.DASHBOARD:
        return <DashboardPage />
      case PAGE_KEYS.TASKS:
        return <TasksPage />
      case PAGE_KEYS.TASK_DETAIL:
        return <TaskDetailPage />
      case PAGE_KEYS.CREATE_TASK:
        return <CreateTaskPage />
      case PAGE_KEYS.USERS:
        return <UsersPage />
      case PAGE_KEYS.REPORTS:
        return <ReportsPage />
      case PAGE_KEYS.PROFILE:
        return <ProfilePage />
      case PAGE_KEYS.FORBIDDEN:
        return <ForbiddenPage />
      case PAGE_KEYS.API_BLOCKED:
        return <ApiBlockedPage />
      default:
        return <DashboardPage />
    }
  }, [activePage, uiPreviewRole])

  if (activePage === PAGE_KEYS.LOGIN) {
    return <LoginPage />
  }

  if (activePage === PAGE_KEYS.SIGNUP) {
    return <SignupPage />
  }

  return (
    <DashboardLayout
      activePage={activePage}
      setActivePage={setActivePage}
      uiPreviewRole={uiPreviewRole}
      setUiPreviewRole={setUiPreviewRole}
      backendAuthHint={backendAuthHint}
      triggerRefresh={triggerRefresh}
      isLoggedIn={isLoggedIn}
      sessionUsername={sessionUsername}
      onLogin={() => setActivePage(PAGE_KEYS.LOGIN)}
      onSignUp={() => setActivePage(PAGE_KEYS.SIGNUP)}
      onLogout={logout}
    >
      <Suspense fallback={<Loader label="Loading page…" />}>{content}</Suspense>
    </DashboardLayout>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Toaster toastOptions={{ duration: 4500 }} />
      <AppShell />
    </AppStateProvider>
  )
}
