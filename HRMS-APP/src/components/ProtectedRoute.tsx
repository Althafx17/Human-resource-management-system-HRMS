// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { Navigate, Outlet } from 'react-router-dom';
import { authUtils } from '../utils/authUtils';

// ==========================================
// 2. MAIN COMPONENT ROUTE GUARD
// ==========================================

export default function ProtectedRoute() {
  const token = authUtils.getAccessToken() || authUtils.getCookie('access_token') || localStorage.getItem('access_token');
  const isAuthenticated = !!token && token !== 'undefined' && token !== 'null';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
