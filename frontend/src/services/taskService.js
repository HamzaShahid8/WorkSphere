import { apiClient } from '../lib/api'

/**
 * Task API — paths match Django REST router under /api/
 */
export async function getTasks() {
  const { data } = await apiClient.get('/api/task/')
  return data
}

export async function getTaskById(id) {
  const { data } = await apiClient.get(`/api/task/${id}/`)
  return data
}

export async function createTask(payload) {
  const { data } = await apiClient.post('/api/task/', payload)
  return data
}

export async function updateTask(id, payload) {
  const { data } = await apiClient.patch(`/api/task/${id}/`, payload)
  return data
}

export async function deleteTask(id) {
  await apiClient.delete(`/api/task/${id}/`)
}
