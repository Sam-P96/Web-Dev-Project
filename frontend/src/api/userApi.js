import { apiFetch } from './client';

// PUT /users/:id — self or admin only (checked by the backend)
export const updateUser = (id, changes) =>
  apiFetch(`/users/${id}`, { method: 'PUT', body: changes });

// GET /users — staff only; every user (filter by role on the page)
export const getAllUsers = ({ signal } = {}) =>
  apiFetch('/users', { signal });