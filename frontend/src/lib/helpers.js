/**
 * Build id -> user map for resolving ForeignKey ids from task payloads.
 */
export function buildUserMap(users) {
  if (!Array.isArray(users)) return {}
  return users.reduce((acc, u) => {
    if (u && typeof u.id !== 'undefined') acc[u.id] = u
    return acc
  }, {})
}

/**
 * Display label for assigned_by / created_by (backend field names unchanged in API).
 */
export function formatUserRef(userMap, id) {
  if (id == null || id === '') return '—'
  const u = userMap[id]
  if (u?.username) return u.username
  return `User #${id}`
}

export function formatDate(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return String(isoString)
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return String(isoString)
  }
}

export function sortTasksByCreatedAtDesc(tasks) {
  if (!Array.isArray(tasks)) return []
  return [...tasks].sort((a, b) => {
    const ta = new Date(a.created_at || 0).getTime()
    const tb = new Date(b.created_at || 0).getTime()
    return tb - ta
  })
}

/** DRF list may be a bare array or paginated shape. */
export function normalizeListResponse(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

export function getSummaryMetricEntries(summary) {
  if (!summary || typeof summary !== 'object') return []
  return Object.entries(summary).map(([key, value]) => ({
    key,
    value: Number(value) || 0,
  }))
}

export function formatStatusKey(key) {
  return String(key || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}
