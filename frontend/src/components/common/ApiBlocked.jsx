import { ShieldAlert } from 'lucide-react'
import Button from './Button'
import { MSG_API_BLOCKED } from '../../config/constants'

export default function ApiBlocked({
  onRetry,
  onViewNotes,
  onSignIn,
  onSignUp,
  title = 'API access blocked',
  message = MSG_API_BLOCKED,
}) {
  return (
    <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onSignIn ? (
              <Button type="button" variant="primary" onClick={onSignIn}>
                Sign in
              </Button>
            ) : null}
            {onSignUp ? (
              <Button type="button" variant="secondary" onClick={onSignUp}>
                Create account
              </Button>
            ) : null}
            <Button type="button" variant={onSignIn ? 'secondary' : 'primary'} onClick={onRetry}>
              Retry
            </Button>
            <Button type="button" variant="outline" onClick={onViewNotes}>
              View API Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
