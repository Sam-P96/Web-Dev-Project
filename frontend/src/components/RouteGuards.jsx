import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

// Client-side guards are UX only — real protection is requireAuth/requireRole on the backend.

// <RequireAuth> — logged in only; <RequireAuth roles={['worker','admin']}> — plus role check
export function RequireAuth({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Remember where they wanted to go, so Login can send them back (Phase 4)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Login/register pages: already logged in -> go home
export function GuestOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}
