import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const authClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export function setCookie(name: string, value: string, days: number): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
}

export function deleteCookie(name: string): void {
  document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
}

export const authApi = {
  async login(username: string, password: string): Promise<{ access: string; refresh?: string }> {
    // Updated endpoint to /users/login/ (plural, with trailing slash)
    const response = await authClient.post<{ access: string; refresh?: string }>('/users/login/', { username, password });
    
    if (response.data && response.data.access) {
      // Save in cookies for 30 days
      setCookie('access_token', response.data.access, 30);
      if (response.data.refresh) {
        setCookie('refresh_token', response.data.refresh, 30);
      }
      setCookie('username', username, 30);

      // Keep in localStorage as backup
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      localStorage.setItem('username', username);
    }
    return response.data;
  },

  logout(): void {
    // Clear cookies
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    deleteCookie('username');

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return !!(getCookie('access_token') || localStorage.getItem('access_token'));
  }
};