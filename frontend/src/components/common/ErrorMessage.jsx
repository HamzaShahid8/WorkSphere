import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ title, message, className = '' }) {
  return (
    <div
      className={`flex gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-red-800 ${className}`}
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}
