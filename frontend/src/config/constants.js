/** Allowed internal navigation page keys (no React Router). */
export const PAGE_KEYS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  DASHBOARD: 'dashboard',
  TASKS: 'tasks',
  TASK_DETAIL: 'task-detail',
  CREATE_TASK: 'create-task',
  USERS: 'users',
  REPORTS: 'reports',
  PROFILE: 'profile',
  FORBIDDEN: 'forbidden',
  API_BLOCKED: 'api-blocked',
}

export const UI_PREVIEW_ROLES = ['admin', 'manager', 'employee']

export const TASK_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

/** Message when API returns 401 without a valid session. */
export const MSG_AUTH_REQUIRED =
  'You need to sign in with a valid WorkSphere account to load this data.'

/** Full API blocked panel copy when not authenticated. */
export const MSG_API_BLOCKED =
  'The backend requires a valid JWT. Sign in with your username and password, or use Sign out and sign in again if your session expired.'

export const MSG_ROLE_PREVIEW_NOTE =
  'Role preview controls frontend layout only. Backend permissions still control real API access.'
