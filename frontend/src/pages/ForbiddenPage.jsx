import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { PAGE_KEYS } from '../config/constants'
import { useAppState } from '../state/appState'

export default function ForbiddenPage() {
  const { setActivePage } = useAppState()

  return (
    <div className="mx-auto max-w-lg text-center">
      <PageHeader title="Forbidden" />
      <div className="rounded-xl border border-red-100 bg-white p-8 shadow-sm">
        <p className="text-lg font-medium text-gray-900">
          You do not have permission to access this page.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This restriction comes from the UI role preview only. Backend permissions are
          still enforced on every API call.
        </p>
        <Button
          type="button"
          variant="primary"
          className="mt-6"
          onClick={() => setActivePage(PAGE_KEYS.DASHBOARD)}
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
