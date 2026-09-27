// One place for every backend call: base URL + JSON + JWT token + 401 handling.
// Pages/components should call the *Api.js helpers, not fetch() directly.

const API = import.meta.env.VITE_API_URL;

// localStorage "user" = { _id, email, name, role, token } (saved after signup/login)
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null; // corrupted value -> treat as logged out
  }
};

// AuthContext (Phase 3) listens to this to update the UI when the token dies
export const AUTH_LOGOUT_EVENT = 'auth:logout';

/**
 * apiFetch('/cars', { method: 'POST', body: carData })
 * Always resolves to { ok, status, data } — fetch does NOT throw on 4xx/5xx,
 * so callers check `ok`. Only a network failure ends up in `data.error`.
 */
export async function apiFetch(path, { body, headers, ...options } = {}) {
  const user = getStoredUser();

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err; // let useEffect cleanup ignore it
    return { ok: false, status: 0, data: { error: 'Could not reach the server' } };
  }

  // We sent a token and the server rejected it -> expired/invalid: log out locally
  if (res.status === 401 && user?.token) {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  }

  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

// Backend is mid-migration from { message } to { error }: read both
export const errorMessage = (data, fallback = 'Something went wrong') =>
  data?.error ?? data?.message ?? fallback;
