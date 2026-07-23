// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { axiosInstance } from '../config/axiosInstance';
import { authUtils } from '../../utils/authUtils';

// ==========================================
// 2. TYPES
// ==========================================

export type UserRole = 'admin' | 'hr' | 'employee';

export interface LoginResponse {
  access: string;
  refresh?: string;
  /** Backend may return role directly; if not, we decode from JWT. */
  role?: UserRole;
  /** Backend may return user_id directly; if not, we decode from JWT. */
  user_id?: number;
}

interface JwtPayload {
  user_id?: number;
  role?: UserRole;
  email?: string;
  exp?: number;
  iat?: number;
}

// ==========================================
// 3. HELPERS
// ==========================================

/**
 * Decodes the payload section of a JWT without verifying the signature.
 * Verification happens server-side; here we only need to read claims
 * for UI routing. Never use decoded JWT data for security enforcement.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → Base64 → JSON
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

// ==========================================
// 4. LOGIN API SERVICE
// ==========================================

export const loginApi = {
  /**
   * Authenticates user credentials with the backend.
   * Django backend expects a trailing slash: /users/login/.
   *
   * After a successful login this function:
   *   1. Stores access + refresh tokens (cookies + localStorage).
   *   2. Extracts role and user_id from the JWT payload or response body.
   *   3. Persists role and user_id in localStorage for AuthRoleContext.
   */
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>('/users/login/', credentials);
    const data = response.data;

    if (data?.access) {
      // --- Token storage (unchanged from original) ---
      authUtils.setTokens(data.access, data.refresh || '');
      authUtils.setCookie('access_token', data.access, 30);
      if (data.refresh) authUtils.setCookie('refresh_token', data.refresh, 30);
      authUtils.setCookie('email', credentials.email, 30);
      localStorage.setItem('access_token', data.access);
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('email', credentials.email);

      // --- Extract role + user_id ---
      // Prefer explicit payload fields; fall back to JWT decode.
      const payload = decodeJwtPayload(data.access);
      const role: UserRole = data.role ?? payload?.role ?? 'employee';
      const userId: number | null = data.user_id ?? payload?.user_id ?? null;

      localStorage.setItem('role', role);
      if (userId !== null) localStorage.setItem('user_id', String(userId));
    }

    return data;
  },

  /**
   * Clears all session data and redirects to /login.
   */
  logout(): void {
    authUtils.clearTokens();
    authUtils.deleteCookie('access_token');
    authUtils.deleteCookie('refresh_token');
    authUtils.deleteCookie('email');

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');

    window.location.href = '/login';
  },

  /**
   * Returns true if an access token is present and non-empty.
   */
  isAuthenticated(): boolean {
    const token =
      authUtils.getAccessToken() ||
      authUtils.getCookie('access_token') ||
      localStorage.getItem('access_token');
    return !!token && token !== 'undefined' && token !== 'null';
  },
};
