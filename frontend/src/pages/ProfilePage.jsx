import PageHeader from '../components/common/PageHeader'
import { useAppState } from '../state/appState'
import { MSG_ROLE_PREVIEW_NOTE } from '../config/constants'
import { getStoredUsername } from '../lib/authStorage'

function hintLabel(hint) {
  switch (hint) {
    case 'authenticated':
      return 'The API accepted your JWT on recent requests.'
    case 'unauthenticated':
      return 'Sign in from the header, or your session expired — sign in again.'
    case 'forbidden':
      return 'A recent response was 403 Forbidden for your account scope.'
    case 'unreachable':
      return 'Network or CORS prevented reaching the API — check VITE_API_BASE_URL and server availability.'
    case 'error':
      return 'A non-auth API error occurred — see toast notifications or retry.'
    default:
      return 'No API calls have completed yet, or status is still unknown.'
  }
}

export default function ProfilePage() {
  const { uiPreviewRole, backendAuthHint } = useAppState()
  const signedInAs = getStoredUsername()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Session, UI preview role, and integration notes"
      />

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Signed in</h2>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          {signedInAs || '—'}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          JWT access and refresh tokens are stored in the browser for this origin. Use
          Sign out in the header to clear them.
        </p>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">UI role preview</h2>
        <p className="mt-2 text-3xl font-bold capitalize text-indigo-600">
          {uiPreviewRole}
        </p>
        <p className="mt-2 text-sm text-gray-500">{MSG_ROLE_PREVIEW_NOTE}</p>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Backend auth status</h2>
        <p className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-700">
          {backendAuthHint}
        </p>
        <p className="mt-3 text-sm text-gray-600">{hintLabel(backendAuthHint)}</p>
      </section>

      <section className="rounded-xl border border-amber-50 bg-amber-50/40 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-amber-950">Integration note</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
          Optional dev-only: <code className="rounded bg-white/80 px-1">VITE_DEV_BEARER_TOKEN</code>{' '}
          in <code className="rounded bg-white/80 px-1">.env</code> (see docs). A future
          &quot;current user&quot; REST endpoint can be wired through{' '}
          <code className="rounded bg-white/80 px-1">userService</code>. See{' '}
          <strong className="font-semibold">FRONTEND_API_NOTES.md</strong> for details.
        </p>
      </section>
    </div>
  )
}
