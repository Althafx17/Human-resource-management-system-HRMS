// ==========================================
// 1. IMPORTS & CONFIGURATIONS
// ==========================================
import axios from 'axios';
import { getCookie, deleteCookie } from '../utils/cookieUtils';

// Base URL resolves to backend target or local dev proxy
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 2. AXIOS INTERCEPTORS (REQUEST)
// ==========================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token') || localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear cookie credentials
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      deleteCookie('username');

      // Clear local storage backups
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      
      // Auto-redirect to login screen
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
