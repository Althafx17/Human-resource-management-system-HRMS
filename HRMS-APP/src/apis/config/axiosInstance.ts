// ---> CHANGED: Central axios instance with JWT request/response interceptors using localStorage
import axios from 'axios';

const apiBaseUrl = 'https://employee-management-api-sigma.vercel.app/api';

// Create the base Axios instance
export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 1. REQUEST INTERCEPTOR: Automatically attach Bearer tokens from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Handle 401 Unauthorized errors and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized AND original request is not login/refresh and hasn't been retried yet
    const isUnauthorized = error.response?.status === 401;
    const isLoginOrRefresh = originalRequest.url?.includes('/users/login/') || originalRequest.url?.includes('/users/refresh/');

    if (isUnauthorized && !isLoginOrRefresh && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh endpoint using raw axios to bypass the request interceptor
        const response = await axios.post(`${apiBaseUrl}/users/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Session expired. Redirecting to login.', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
