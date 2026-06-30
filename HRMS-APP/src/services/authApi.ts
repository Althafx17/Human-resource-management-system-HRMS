import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const authClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  async login(username: string, password: string): Promise<{ access: string; refresh?: string }> {
    // Updated endpoint to /users/login/ (plural, with trailing slash)
    const response = await authClient.post<{ access: string; refresh?: string }>('/users/login/', { username, password });
    
    if (response.data && response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      localStorage.setItem('username', username);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
};