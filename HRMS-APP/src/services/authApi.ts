// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { axiosInstance } from './axiosInstance';
import { getCookie, setCookie, deleteCookie } from '../utils/cookieUtils';

// ==========================================
// 2. MAIN COMPONENT / SERVICE
// ==========================================

export const authApi = {
  /**
   * Authenticates user credentials with the backend.
   * Note: Django backend expects a trailing slash on this path and is plural: /users/login/.
   * Saves JWT tokens in cookies for 30-day session preservation, and seeds local storage as a fallback.
   * 
   * @param {string} username - User login account name.
   * @param {string} password - User password.
   * @returns {Promise<{ access: string; refresh?: string }>} Access & refresh tokens response.
   */
  async login(username: string, password: string): Promise<{ access: string; refresh?: string }> {
    const response = await axiosInstance.post<{ access: string; refresh?: string }>('/users/login/', { username, password });
    
    if (response.data && response.data.access) {
      // Save tokens in cookies for 30 days
      setCookie('access_token', response.data.access, 30);
      if (response.data.refresh) {
        setCookie('refresh_token', response.data.refresh, 30);
      }
      setCookie('username', username, 30);

      // Keep in localStorage as backup compatibility
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      localStorage.setItem('username', username);
    }
    return response.data;
  },

  /**
   * Performs session logouts.
   * Wipes authorization tokens from both cookies and local storage, then redirects to /login.
   */
  logout(): void {
    // Clear cookies
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    deleteCookie('username');

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    
    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Assesses whether a user session token is present in cookies or local storage.
   * 
   * @returns {boolean} True if authenticated, else false.
   */
  isAuthenticated(): boolean {
    return !!(getCookie('access_token') || localStorage.getItem('access_token'));
  }
};