// ==========================================
// 1. IMPORTS & CONFIGURATIONS
// ==========================================
import axios from 'axios';
import { authUtils } from '../utils/authUtils';

// Base URL resolves to backend target or local dev proxy
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper to extract CSRF token from cookies if present
const getCsrfToken = () => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// ---> CHANGED: Enable withCredentials for cookie management & CSRF protection
export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 2. AXIOS INTERCEPTORS (REQUEST)
// ==========================================

axiosInstance.interceptors.request.use(
  (config) => {
    // ---> CHANGED: Attach Authorization: Bearer <token> header to all requests
    const token = authUtils.getAccessToken() || authUtils.getCookie('access_token') || localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach CSRF Token if present in cookies
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// 3. AXIOS INTERCEPTORS (RESPONSE)
// ==========================================

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ---> NEW: Intercept 401 error and trigger silent refresh token rotation
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Extract current refresh token
      const refreshToken = authUtils.getRefreshToken() || authUtils.getCookie('refresh_token') || localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Attempt silent token refresh via backend
          const refreshResponse = await axios.post(`${apiBaseUrl}/users/refresh/`, {
            refresh: refreshToken,
          });

          if (refreshResponse.status === 200 || refreshResponse.status === 201) {
            const newAccessToken = refreshResponse.data.access;
            
            // Save new tokens
            authUtils.setTokens(newAccessToken, refreshToken);
            authUtils.setCookie('access_token', newAccessToken, 30);
            localStorage.setItem('access_token', newAccessToken);

            // Update Authorization header on original request and retry
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Failed to rotate expired access token:', refreshError);
        }
      }

      // ---> CHANGED: Clear credentials and redirect to login if refresh fails
      authUtils.clearTokens();
      authUtils.deleteCookie('access_token');
      authUtils.deleteCookie('refresh_token');
      authUtils.deleteCookie('username');

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
