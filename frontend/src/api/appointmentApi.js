import { apiFetch } from './client';

// All appointment routes need a token (sent automatically by apiFetch)

// GET /appointments?worker=<id>
export const getAppointmentsByWorker = (workerId, { signal } = {}) =>
  apiFetch(`/appointments?worker=${workerId}`, { signal });

// PUT /appointments/:id — body only contains the fields to change
export const updateAppointment = (id, changes) =>
  apiFetch(`/appointments/${id}`, { method: 'PUT', body: changes });

// POST /appointments — body is the new appointment
export const createAppointment = (appointmentData) =>
  apiFetch('/appointments', { method: 'POST', body: appointmentData });

// GET /appointments — every appointment (no worker filter)
export const getAllAppointments = ({ signal } = {}) =>
  apiFetch('/appointments', { signal });

// DELETE /appointments/:id — removes it permanently
export const deleteAppointment = (id) =>
  apiFetch(`/appointments/${id}`, { method: 'DELETE' });