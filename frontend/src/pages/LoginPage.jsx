import { useState } from 'react'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { loginWithPassword } from '../services/authService'
import { normalizeApiError } from '../lib/api'
import { useAppState } from '../state/appState'
import { PAGE_KEYS } from '../config/constants'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { setActivePage, markAuthOk, notifySessionChanged, triggerRefresh } =
    useAppState()

  async function onSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password) {
      toast.error('Enter username and password.')
      return
    }
    setSubmitting(true)
    try {
      await loginWithPassword(username.trim(), password)
      toast.success('Signed in successfully.')
      markAuthOk()
      notifySessionChanged()
      triggerRefresh()
      setActivePage(PAGE_KEYS.DASHBOARD)
    } catch (err) {
      const n = err?.isNormalized ? err : normalizeApiError(err)
      toast.error(n.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
            <LogIn className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            WorkSphere
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to load tasks and dashboard data from the API.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={submitting}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Need an account?{' '}
          <button
            type="button"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
            onClick={() => setActivePage(PAGE_KEYS.SIGNUP)}
          >
            Sign up
          </button>
        </p>
        <p className="mt-3 text-center text-xs text-gray-500">
          Managers and admins are usually created in Django admin; employees can sign up
          here.
        </p>
      </div>
    </div>
  )
}
