import { PAGE_KEYS } from './constants'

/**
 * Sidebar entries per UI preview role.
 * pageKey maps to activePage state (not browser routes).
 */
export function getSidebarNav(uiPreviewRole) {
  const commonBottom = [
    { pageKey: PAGE_KEYS.PROFILE, label: 'Profile', icon: 'user' },
  ]

  if (uiPreviewRole === 'admin') {
    return [
      { pageKey: PAGE_KEYS.DASHBOARD, label: 'Dashboard', icon: 'layout-dashboard' },
      { pageKey: PAGE_KEYS.TASKS, label: 'All Tasks', icon: 'list-checks' },
      { pageKey: PAGE_KEYS.USERS, label: 'Users', icon: 'users' },
      { pageKey: PAGE_KEYS.REPORTS, label: 'Reports', icon: 'bar-chart-3' },
      ...commonBottom,
    ]
  }

  if (uiPreviewRole === 'manager') {
    return [
      { pageKey: PAGE_KEYS.DASHBOARD, label: 'Dashboard', icon: 'layout-dashboard' },
      { pageKey: PAGE_KEYS.TASKS, label: 'My Tasks', icon: 'list-checks' },
      { pageKey: PAGE_KEYS.CREATE_TASK, label: 'Create Task', icon: 'plus-circle' },
      { pageKey: PAGE_KEYS.REPORTS, label: 'Reports', icon: 'bar-chart-3' },
      ...commonBottom,
    ]
  }

  return [
    { pageKey: PAGE_KEYS.DASHBOARD, label: 'Dashboard', icon: 'layout-dashboard' },
    { pageKey: PAGE_KEYS.TASKS, label: 'My Assigned Tasks', icon: 'list-checks' },
    { pageKey: PAGE_KEYS.REPORTS, label: 'Reports', icon: 'bar-chart-3' },
    ...commonBottom,
  ]
}

export function tasksPageTitle(uiPreviewRole) {
  if (uiPreviewRole === 'admin') return 'All Tasks'
  if (uiPreviewRole === 'manager') return 'My Tasks'
  return 'My Assigned Tasks'
}

export function canAccessPage(uiPreviewRole, pageKey) {
  if (pageKey === PAGE_KEYS.LOGIN || pageKey === PAGE_KEYS.SIGNUP) return true
  if (pageKey === PAGE_KEYS.USERS) return uiPreviewRole === 'admin'
  if (pageKey === PAGE_KEYS.CREATE_TASK) return uiPreviewRole === 'manager'
  return true
}
