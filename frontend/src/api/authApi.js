import { apiFetch } from './client';

// Both return { ok, status, data }; on success data = { _id, email, name, role, token }
export const signup = (userData) =>
  apiFetch('/users/signup', { method: 'POST', body: userData });

export const login = (email, password) =>
  apiFetch('/users/login', { method: 'POST', body: { email, password } });

// Needs a token (sent automatically by apiFetch)
export const getMe = () => apiFetch('/users/me');
