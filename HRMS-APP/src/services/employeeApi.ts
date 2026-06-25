import axios from 'axios';
import type { EmployeeData } from '../pages/employees/types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://employee-management-api-sigma.vercel.app/api';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login page
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export const employeeApi = {
  async getAll(): Promise<PaginatedResponse<EmployeeData>> {
    const response = await apiClient.get<PaginatedResponse<EmployeeData>>('/employees');
    return response.data;
  },

  async getById(id: string): Promise<EmployeeData> {
    const response = await apiClient.get<EmployeeData>(`/employees/${id}`);
    return response.data;
  },

  async create(data: Partial<EmployeeData>): Promise<EmployeeData> {
    const response = await apiClient.post<EmployeeData>('/employees', data);
    return response.data;
  },

  async update(id: string, data: Partial<EmployeeData>): Promise<EmployeeData> {
    const response = await apiClient.put<EmployeeData>(`/employees/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },
};
