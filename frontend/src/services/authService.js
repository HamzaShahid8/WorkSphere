import axios from 'axios'
import { getApiBaseURL } from '../lib/api'
import {
  clearAuthStorage,
  setAccessToken,
  setStoredUsername,
  setTokens,
} from '../lib/authStorage'

/**
 * POST /accounts/register/ — public signup (backend creates **employee** users only).
 */
export async function registerUser({
  username,
  email,
  password,
  password_confirm,
}) {
  const base = getApiBaseURL()
  const { data } = await axios.post(
    `${base}/accounts/register/`,
    { username, email, password, password_confirm },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
  )
  return data
}

/**
 * POST /accounts/login/ — returns { access, refresh } (djangorestframework-simplejwt).
 */
export async function loginWithPassword(username, password) {
  const base = getApiBaseURL()
  const { data } = await axios.post(
    `${base}/accounts/login/`,
    { username, password },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
  )
  if (data?.access) {
    setTokens(data.access, data.refresh || '')
    setStoredUsername(username)
  }
  return data
}

/**
 * POST /accounts/refresh/ — used by api interceptor; exported for tests.
 */
export async function refreshAccessToken(refreshToken) {
  const base = getApiBaseURL()
  const { data } = await axios.post(
    `${base}/accounts/refresh/`,
    { refresh: refreshToken },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
  )
  if (data?.access) setAccessToken(data.access)
  return data
}

export function logoutClient() {
  clearAuthStorage()
}
