export function useCurrentUser() {
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  return user ?? { _id: import.meta.env.VITE_DEV_WORKER_ID, role: 'worker' };
}
