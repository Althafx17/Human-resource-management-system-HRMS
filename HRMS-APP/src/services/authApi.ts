// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { axiosInstance } from './axiosInstance';
import { authUtils } from '../utils/authUtils';

// ==========================================
// 2. MAIN COMPONENT / SERVICE
// ==========================================

export const authApi = {
  /**
   * Authenticates user credentials with the backend.
   * Django backend expects a trailing slash: /users/login/.
   */
  async login(credentials: { username: string; password: string }): Promise<{ access: string; refresh?: string }> {
    const response = await axiosInstance.post<{ access: string; refresh?: string }>('/users/login/', credentials);
    
    if (response.data && response.data.access) {
      // Save tokens inside authUtils cookies
      authUtils.setTokens(response.data.access, response.data.refresh || '');
      
      // Save tokens in custom cookies for backwards compatibility
      authUtils.setCookie('access_token', response.data.access, 30);
      if (response.data.refresh) {
        authUtils.setCookie('refresh_token', response.data.refresh, 30);
      }
      authUtils.setCookie('username', credentials.username, 30);

      // Keep in localStorage as backup compatibility
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      localStorage.setItem('username', credentials.username);
    }
    return response.data;
  },

  /**
   * Performs session logouts.
   */
  logout(): void {
    // Clear authUtils tokens
    authUtils.clearTokens();

    // Clear custom cookies
    authUtils.deleteCookie('access_token');
    authUtils.deleteCookie('refresh_token');
    authUtils.deleteCookie('username');

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    
    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Assesses whether a user session token is present in cookies or local storage.
   */
  isAuthenticated(): boolean {
    return !!(authUtils.getAccessToken() || authUtils.getCookie('access_token') || localStorage.getItem('access_token'));
  }
};