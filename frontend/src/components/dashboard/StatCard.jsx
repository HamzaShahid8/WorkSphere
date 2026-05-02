import { TrendingUp } from 'lucide-react'

export default function StatCard({
  title,
  value,
  loading,
  blocked,
  footnote,
}) {
  if (blocked) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-3 text-sm text-gray-400">Unavailable until API access</p>
        {footnote ? (
          <p className="mt-2 text-xs text-gray-400">{footnote}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {loading ? '…' : value ?? '—'}
          </p>
          {footnote ? (
            <p className="mt-2 text-xs text-gray-400">{footnote}</p>
          ) : null}
        </div>
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
