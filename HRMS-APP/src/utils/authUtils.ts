// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import Cookies from 'js-cookie';

// ==========================================
// 2. CONSOLIDATED AUTH & COOKIE UTILITIES
// ==========================================

export const authUtils = {
  /**
   * Sets JWT Access (1 day expiry) and Refresh (7 days expiry) tokens inside cookies.
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set('access_token', accessToken, { expires: 1, secure: true, sameSite: 'strict' });
    Cookies.set('refresh_token', refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
  },

  /**
   * Retrieves the access token.
   */
  getAccessToken: () => Cookies.get('access_token'),

  /**
   * Retrieves the refresh token.
   */
  getRefreshToken: () => Cookies.get('refresh_token'),

  /**
   * Clears both JWT cookies.
   */
  clearTokens: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  },

  /**
   * General cookie getter (replacing custom document.cookie parser).
   */
  getCookie: (name: string) => Cookies.get(name),

  /**
   * General cookie setter (replacing custom document.cookie builder).
   */
  setCookie: (name: string, value: string, days: number) => {
    Cookies.set(name, value, { expires: days, secure: true, sameSite: 'lax' });
  },

  /**
   * General cookie removal.
   */
  deleteCookie: (name: string) => {
    Cookies.remove(name);
  }
};
