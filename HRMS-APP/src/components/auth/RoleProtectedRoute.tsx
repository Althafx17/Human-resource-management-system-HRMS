import { Navigate, Outlet } from 'react-router-dom';
import { useAuthRole } from '../../contexts/AuthRoleContext';
import type { UserRole } from '../../apis/auth/loginApi';

// ==========================================
// ROLE PROTECTED ROUTE
// ==========================================
// Usage in App.tsx:
//   <Route element={<RoleProtectedRoute roles={['admin', 'hr']} />}>
//     ...admin/HR-only routes...
//   </Route>
//
// If `roles` is omitted, any authenticated user is allowed through.

interface RoleProtectedRouteProps {
  /** Allowed roles. Omit to allow any authenticated user. */
  roles?: UserRole[];
  /** Where to redirect if unauthenticated. Defaults to /login. */
  loginPath?: string;
  /** Where to redirect if authenticated but wrong role. Defaults to /unauthorized. */
  forbiddenPath?: string;
}

export default function RoleProtectedRoute({
  roles,
  loginPath = '/login',
  forbiddenPath = '/unauthorized',
}: RoleProtectedRouteProps) {
  const { isAuthenticated, isResolved, role } = useAuthRole();

  // Wait until localStorage has been read to avoid flash of redirect
  if (!isResolved) return null;

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }

  if (roles && roles.length > 0 && role && !roles.includes(role)) {
    return <Navigate to={forbiddenPath} replace />;
  }

  return <Outlet />;
}
