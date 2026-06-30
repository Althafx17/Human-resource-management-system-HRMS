import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../services/authApi';

export default function ProtectedRoute() {
  const token = getCookie('access_token') || localStorage.getItem('access_token');
  const isAuthenticated = !!token && token !== 'undefined' && token !== 'null';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
