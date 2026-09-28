import { createContext, useContext } from 'react';

// Value: { user, isAuthenticated, saveUser, logout } — provided by <AuthProvider>
export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
