import { apiClient } from '../lib/api'

/**
 * User API — Django router registers under /accounts/user/
 */
export async function getUsers() {
  const { data } = await apiClient.get('/accounts/user/')
  return data
}

export async function getUserById(id) {
  const { data } = await apiClient.get(`/accounts/user/${id}/`)
  return data
}

export async function createUser(payload) {
  const { data } = await apiClient.post('/accounts/user/', payload)
  return data
}

export async function updateUser(id, payload) {
  const { data } = await apiClient.patch(`/accounts/user/${id}/`, payload)
  return data
}

export async function deleteUser(id) {
  await apiClient.delete(`/accounts/user/${id}/`)
}
