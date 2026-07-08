// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import Cookies from 'js-cookie';

// ==========================================
// 2. AUTH TOKEN COOKIE MANAGERS
// ==========================================

export const authUtils = {
  /**
   * Sets access and refresh JWT tokens inside secure cookies.
   * Access token is configured to expire in 1 day, refresh token in 7 days.
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set('access_token', accessToken, { expires: 1, secure: true, sameSite: 'strict' });
    Cookies.set('refresh_token', refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
  },

  /**
   * Retrieves the access token string.
   */
  getAccessToken: () => Cookies.get('access_token'),

  /**
   * Retrieves the refresh token string.
   */
  getRefreshToken: () => Cookies.get('refresh_token'),

  /**
   * Wipes both tokens from cookies.
   */
  clearTokens: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }
};
