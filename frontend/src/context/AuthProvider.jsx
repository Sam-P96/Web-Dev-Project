import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { AUTH_LOGOUT_EVENT, getStoredUser } from '@/api/client';

// JWT payload is base64url JSON; `exp` is in seconds. Unreadable token = expired.
const isTokenExpired = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Only trust a stored user that has a non-expired token
// (course version accepted any truthy value, e.g. {} or a user without token)
const loadUser = () => {
  const user = getStoredUser();
  if (!user?.token || isTokenExpired(user.token)) {
    localStorage.removeItem('user');
    return null;
  }
  return user;
};

export default function AuthProvider({ children }) {
  // Lazy initializer: read localStorage once on mount, so F5 keeps you logged in
  const [user, setUser] = useState(loadUser);

  // Call after a successful signup/login with the API response { _id, email, name, role, token }
  const saveUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    // apiFetch got a 401 with our token -> it already cleared storage, sync the UI
    const onForcedLogout = () => setUser(null);
    // Login/logout in another tab
    const onStorage = (e) => {
      if (e.key === 'user') setUser(loadUser());
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, onForcedLogout);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, onForcedLogout);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const value = { user, isAuthenticated: !!user, saveUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
