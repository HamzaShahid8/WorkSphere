import { Loader2 } from 'lucide-react'

export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-gray-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
