import { apiClient } from '../lib/api'

/**
 * Dashboard summary endpoint from Django dashboard app.
 */
export async function getDashboardSummary() {
  const { data } = await apiClient.get('/api/dashboard/')
  return data
}
