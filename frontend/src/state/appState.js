import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { PAGE_KEYS } from '../config/constants'
import { clearAuthStorage, hasAuthSession } from '../lib/authStorage'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [activePage, setActivePage] = useState(() =>
    hasAuthSession() ? PAGE_KEYS.DASHBOARD : PAGE_KEYS.LOGIN,
  )
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [uiPreviewRole, setUiPreviewRole] = useState('admin')
  const [refreshNonce, setRefreshNonce] = useState(0)
  const [authSessionVersion, setAuthSessionVersion] = useState(0)
  const [backendAuthHint, setBackendAuthHint] = useState('unknown')

  const triggerRefresh = useCallback(() => {
    setRefreshNonce((n) => n + 1)
  }, [])

  const notifySessionChanged = useCallback(() => {
    setAuthSessionVersion((v) => v + 1)
  }, [])

  const logout = useCallback(() => {
    clearAuthStorage()
    setBackendAuthHint('unauthenticated')
    setActivePage(PAGE_KEYS.LOGIN)
    setAuthSessionVersion((v) => v + 1)
  }, [])

  const setAuthHintFromError = useCallback((err) => {
    if (!err) return
    if (err.code === 'UNAUTHORIZED') setBackendAuthHint('unauthenticated')
    else if (err.code === 'FORBIDDEN') setBackendAuthHint('forbidden')
    else if (err.code === 'NETWORK' || err.code === 'CORS')
      setBackendAuthHint('unreachable')
    else setBackendAuthHint('error')
  }, [])

  const markAuthOk = useCallback(() => {
    setBackendAuthHint('authenticated')
  }, [])

  const value = useMemo(
    () => ({
      activePage,
      setActivePage,
      selectedTaskId,
      setSelectedTaskId,
      uiPreviewRole,
      setUiPreviewRole,
      refreshNonce,
      triggerRefresh,
      authSessionVersion,
      notifySessionChanged,
      logout,
      backendAuthHint,
      setBackendAuthHint,
      setAuthHintFromError,
      markAuthOk,
    }),
    [
      activePage,
      selectedTaskId,
      uiPreviewRole,
      refreshNonce,
      authSessionVersion,
      triggerRefresh,
      notifySessionChanged,
      logout,
      backendAuthHint,
      setAuthHintFromError,
      markAuthOk,
    ],
  )

  return createElement(
    AppStateContext.Provider,
    { value },
    children,
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
