import { useState } from 'react'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { registerUser, loginWithPassword } from '../services/authService'
import { normalizeApiError } from '../lib/api'
import { useAppState } from '../state/appState'
import { PAGE_KEYS } from '../config/constants'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {
    setActivePage,
    markAuthOk,
    notifySessionChanged,
    triggerRefresh,
  } = useAppState()

  async function onSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password) {
      toast.error('Fill in all fields.')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    if (password !== passwordConfirm) {
      toast.error('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
      })
      toast.success('Account created. Signing you in…')
      await loginWithPassword(username.trim(), password)
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
            <UserPlus className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            New accounts are registered as <strong>employee</strong> role. Admins can
            promote users in Django admin if needed.
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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={submitting}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={submitting}
          />
          <Input
            label="Confirm password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
            onClick={() => setActivePage(PAGE_KEYS.LOGIN)}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
