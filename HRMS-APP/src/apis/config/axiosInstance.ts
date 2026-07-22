import axios from 'axios';
import { authUtils } from '../../utils/authUtils';
import { toastEmitter } from '../../utils/toastEmitter';

const apiBaseUrl = 'https://employee-management-api-sigma.vercel.app/api';

// ==========================================
// AXIOS INSTANCE
// ==========================================

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ==========================================
// 1. REQUEST INTERCEPTOR
// Single source of truth: authUtils (js-cookie) first, localStorage as fallback.
// ==========================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      authUtils.getAccessToken() ||
      localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// 2. RESPONSE INTERCEPTOR
// 401 → attempt token refresh, then redirect on failure.
// Other error codes → emit toast with a friendly message.
// ==========================================

/** Maps HTTP status codes to user-facing messages. */
function friendlyMessage(status: number): string {
  const map: Record<number, string> = {
    400: 'Bad request — please check your input.',
    403: 'You don\'t have permission to do that.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred — this record may already exist.',
    422: 'Validation failed — please review your input.',
    429: 'Too many requests — please wait a moment and try again.',
    500: 'A server error occurred. Please try again shortly.',
    503: 'Service temporarily unavailable. Please try again later.',
  };
  return map[status] ?? `Unexpected error (${status}).`;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status: number | undefined = error.response?.status;

    // --- 401: attempt silent token refresh ---
    const isUnauthorized = status === 401;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/users/login/') ||
      originalRequest?.url?.includes('/users/refresh/');

    if (isUnauthorized && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          authUtils.getRefreshToken() || localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const refreshResponse = await axios.post(`${apiBaseUrl}/users/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess: string = refreshResponse.data.access;
        // Write back to both storage mechanisms to stay in sync
        authUtils.setTokens(newAccess, refreshResponse.data.refresh || refreshToken);
        localStorage.setItem('access_token', newAccess);
        if (refreshResponse.data.refresh) {
          localStorage.setItem('refresh_token', refreshResponse.data.refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      } catch {
        // Refresh failed — clear everything and redirect
        authUtils.clearTokens();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // --- Non-401 errors: emit friendly toast (not 401 — that one is silent/redirects) ---
    if (status && status !== 401) {
      toastEmitter.emit({
        message: friendlyMessage(status),
        type: status >= 500 ? 'error' : 'warning',
        duration: status === 429 ? 6000 : 4000,
      });
    }

    return Promise.reject(error);
  }
);
