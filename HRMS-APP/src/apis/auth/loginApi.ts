// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { axiosInstance } from '../config/axiosInstance';
import { authUtils } from '../../utils/authUtils';

// ==========================================
// 2. LOGIN API SERVICE
// ==========================================

export const loginApi = {
  /**
   * Authenticates user credentials with the backend.
   * Django backend expects a trailing slash: /users/login/.
   * 
   * @param credentials - The user credentials object containing email/username and password.
   * @returns The raw response containing the access and refresh tokens.
   */
  async login(credentials: { email: string; password: string }): Promise<{ access: string; refresh?: string }> {
    const response = await axiosInstance.post<{ access: string; refresh?: string }>('/users/login/', credentials);
    
    if (response.data && response.data.access) {
      // Save tokens inside authUtils cookies
      authUtils.setTokens(response.data.access, response.data.refresh || '');
      
      // Save tokens in custom cookies for backwards compatibility
      authUtils.setCookie('access_token', response.data.access, 30);
      if (response.data.refresh) {
        authUtils.setCookie('refresh_token', response.data.refresh, 30);
      }
      authUtils.setCookie('email', credentials.email, 30);

      // Keep in localStorage as backup compatibility
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      localStorage.setItem('email', credentials.email);
    }
    return response.data;
  },

  /**
   * Performs user session logouts, clearing stored tokens and redirecting to the login screen.
   */
  logout(): void {
    // Clear authUtils tokens
    authUtils.clearTokens();

    // Clear custom cookies
    authUtils.deleteCookie('access_token');
    authUtils.deleteCookie('refresh_token');
    authUtils.deleteCookie('email');

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email');
    
    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Assesses whether a user session token is present in cookies or local storage.
   * 
   * @returns true if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!(authUtils.getAccessToken() || authUtils.getCookie('access_token') || localStorage.getItem('access_token'));
  }
};
