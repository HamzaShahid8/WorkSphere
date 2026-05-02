import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { MSG_API_BLOCKED, PAGE_KEYS } from '../config/constants'
import { useAppState } from '../state/appState'

export default function ApiBlockedPage() {
  const { setActivePage, triggerRefresh } = useAppState()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="API access & integration notes"
        subtitle="Why protected data may be missing in this build"
      />
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm leading-relaxed text-gray-700">{MSG_API_BLOCKED}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
          <li>
            Endpoints under <code className="rounded bg-gray-100 px-1">/api/</code> and{' '}
            <code className="rounded bg-gray-100 px-1">/accounts/</code> require
            authentication configured on the Django REST Framework side.
          </li>
          <li>
            Use <strong className="font-medium text-gray-900">Sign in</strong> in the header
            to obtain JWT access and refresh tokens. Optionally set{' '}
            <code className="rounded bg-gray-100 px-1">VITE_DEV_BEARER_TOKEN</code> in dev
            only if you prefer env-based tokens.
          </li>
          <li>
            For full endpoint notes and backend quirks, open{' '}
            <strong className="font-medium text-gray-900">FRONTEND_API_NOTES.md</strong> in
            the <code className="rounded bg-gray-100 px-1">frontend/</code> directory.
          </li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={() => setActivePage(PAGE_KEYS.LOGIN)}
          >
            Sign in
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setActivePage(PAGE_KEYS.SIGNUP)}
          >
            Create account
          </Button>
          <Button type="button" variant="secondary" onClick={triggerRefresh}>
            Retry data loads
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setActivePage(PAGE_KEYS.PROFILE)}
          >
            Back to profile
          </Button>
        </div>
      </div>
    </div>
  )
}
