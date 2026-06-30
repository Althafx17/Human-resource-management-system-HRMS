// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import axios from 'axios';

// Base URL configuration resolving to proxy route /api
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

// Create configured Axios client for authorization operations
const authClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 2. COOKIE UTIL FUNCTIONS
// ==========================================

/**
 * Retrieves a cookie value by its key/name.
 * 
 * @param {string} name - Name of the cookie to retrieve.
 * @returns {string|null} Cookie string value or null if not found.
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Sets a cookie key-value pair with a specified expiration duration in days.
 * Configured with SameSite=Lax and Secure attributes to ensure standard security compliance.
 * 
 * @param {string} name - Name of the cookie.
 * @param {string} value - String value to store.
 * @param {number} days - Duration in days before the cookie expires.
 */
export function setCookie(name: string, value: string, days: number): void {
  let expires = "";
  if (days) {
    const date = new Date();
    // Compute expiration timestamp in milliseconds
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
}

/**
 * Deletes a cookie key-value pair by overriding it with an expired timestamp.
 * 
 * @param {string} name - Name of the cookie.
 */
export function deleteCookie(name: string): void {
  document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
}

// ==========================================
// 3. MAIN COMPONENT / SERVICE
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
    // Updated endpoint to /users/login/ (plural, with trailing slash)
    const response = await authClient.post<{ access: string; refresh?: string }>('/users/login/', { username, password });
    
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