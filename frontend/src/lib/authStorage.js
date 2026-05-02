const ACCESS = 'worksphere_access'
const REFRESH = 'worksphere_refresh'
const USERNAME = 'worksphere_username'

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS) || ''
  } catch {
    return ''
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH) || ''
  } catch {
    return ''
  }
}

export function getStoredUsername() {
  try {
    return localStorage.getItem(USERNAME) || ''
  } catch {
    return ''
  }
}

export function setTokens(access, refresh) {
  try {
    if (access) localStorage.setItem(ACCESS, access)
    if (refresh) localStorage.setItem(REFRESH, refresh)
  } catch {
    /* ignore */
  }
}

export function setAccessToken(access) {
  try {
    if (access) localStorage.setItem(ACCESS, access)
  } catch {
    /* ignore */
  }
}

export function setStoredUsername(username) {
  try {
    if (username) localStorage.setItem(USERNAME, username)
    else localStorage.removeItem(USERNAME)
  } catch {
    /* ignore */
  }
}

export function clearAuthStorage() {
  try {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem(REFRESH)
    localStorage.removeItem(USERNAME)
  } catch {
    /* ignore */
  }
}

export function hasAuthSession() {
  return !!(getAccessToken() || getRefreshToken())
}
