import axios from 'axios'
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from './authStorage'

export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  NETWORK: 'NETWORK',
  CORS: 'CORS',
  VALIDATION: 'VALIDATION',
  UNKNOWN: 'UNKNOWN',
}

/**
 * API origin for Axios. Set `VITE_API_BASE_URL` in `.env` only — never hardcode in components.
 * - Empty / unset: same-origin requests (use with Vite dev `server.proxy` to reach Django).
 * - Absolute URL: direct browser → Django (requires `CORS_ALLOWED_ORIGINS` on the backend).
 */
/** Exported for auth login/refresh calls that use standalone axios. */
export function getApiBaseURL() {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw === undefined || raw === null) return ''
  const s = String(raw).trim()
  if (s === '') return ''
  return s.replace(/\/$/, '')
}

function getBaseURL() {
  return getApiBaseURL()
}

/**
 * Optional local dev token (e.g. JWT from POST /accounts/login/).
 * Not a login UI — value comes from env only. Stripped in production builds
 * (`import.meta.env.DEV` is false) so tokens are never attached from env in prod.
 */
function getDevBearerToken() {
  if (!import.meta.env.DEV) return ''
  const t = import.meta.env.VITE_DEV_BEARER_TOKEN
  return typeof t === 'string' ? t.trim() : ''
}

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

apiClient.interceptors.request.use((config) => {
  const stored = getAccessToken()
  if (stored) {
    config.headers.Authorization = `Bearer ${stored}`
  } else {
    const dev = getDevBearerToken()
    if (dev) config.headers.Authorization = `Bearer ${dev}`
  }
  return config
})

function shouldAttemptRefresh(config) {
  const path = `${config.baseURL || ''}${config.url || ''}`
  return (
    !path.includes('/accounts/login') &&
    !path.includes('/accounts/refresh')
  )
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const refresh = getRefreshToken()

    if (
      status === 401 &&
      original &&
      !original._wsAuthRetry &&
      refresh &&
      shouldAttemptRefresh(original)
    ) {
      original._wsAuthRetry = true
      try {
        const base = getBaseURL()
        const { data } = await axios.post(
          `${base}/accounts/refresh/`,
          { refresh },
          { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
        )
        if (data?.access) {
          setAccessToken(data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return apiClient.request(original)
        }
      } catch {
        clearAuthStorage()
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)

function isCorsOrNetworkError(error) {
  if (!error.response && error.request) return true
  const msg = String(error.message || '').toLowerCase()
  if (msg.includes('network')) return true
  if (msg.includes('cors')) return true
  return false
}

/** DRF often sends `{ detail: string | string[] }` */
function detailMessage(data) {
  const d = data?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map(String).join(' ')
  return ''
}

/**
 * Normalized API error for UI (never raw Error objects in messages).
 */
export function normalizeApiError(error) {
  if (error?.isNormalized) return error

  const status = error?.response?.status
  const data = error?.response?.data

  let code = API_ERROR_CODES.UNKNOWN
  let message = 'Something went wrong. Please try again.'

  if (error?.code === 'ECONNABORTED') {
    code = API_ERROR_CODES.NETWORK
    message = 'Request timed out. Check your connection and try again.'
  } else if (!error?.response && error?.request) {
    code = API_ERROR_CODES.NETWORK
    message =
      'Unable to reach the server. If the API is running, you may need to configure CORS on the backend or check the API base URL.'
  } else if (isCorsOrNetworkError(error)) {
    code = API_ERROR_CODES.CORS
    message =
      'A network or CORS error occurred. Ensure the backend allows this origin in CORS settings and that VITE_API_BASE_URL is correct.'
  } else if (status === 401) {
    code = API_ERROR_CODES.UNAUTHORIZED
    message =
      detailMessage(data) ||
      'Authentication required. Sign in using the button in the header, or your session may have expired.'
  } else if (status === 403) {
    code = API_ERROR_CODES.FORBIDDEN
    message =
      detailMessage(data) ||
      'You do not have permission to perform this action.'
  } else if (status === 404) {
    code = API_ERROR_CODES.NOT_FOUND
    message = 'The requested resource was not found.'
  } else if (status >= 500) {
    code = API_ERROR_CODES.SERVER
    message = 'The server encountered an error. Please try again later.'
  } else if (status === 400 && data && typeof data === 'object') {
    code = API_ERROR_CODES.VALIDATION
    const firstKey = Object.keys(data)[0]
    if (firstKey) {
      const v = data[firstKey]
      message = Array.isArray(v) ? v.join(' ') : String(v)
    }
  } else if (typeof data?.detail === 'string') {
    message = data.detail
  } else if (typeof data?.message === 'string') {
    message = data.message
  }

  const normalized = {
    isNormalized: true,
    code,
    status,
    message,
    raw: error,
  }
  return normalized
}

export function isUnauthorizedError(err) {
  return err?.code === API_ERROR_CODES.UNAUTHORIZED
}

export function isForbiddenError(err) {
  return err?.code === API_ERROR_CODES.FORBIDDEN
}
