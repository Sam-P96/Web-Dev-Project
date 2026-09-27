import { apiFetch } from './client';

// All appointment routes need a token (sent automatically by apiFetch)

// GET /appointments?worker=<id>
export const getAppointmentsByWorker = (workerId, { signal } = {}) =>
  apiFetch(`/appointments?worker=${workerId}`, { signal });

// PUT /appointments/:id — body only contains the fields to change
export const updateAppointment = (id, changes) =>
  apiFetch(`/appointments/${id}`, { method: 'PUT', body: changes });
