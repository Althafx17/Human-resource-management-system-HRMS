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

const departmentNameToId: Record<string, number> = {
  'Engineering': 1,
  'IT': 1,
  'Human Resources': 2,
  'HR': 2,
  'Finance': 3,
  'Sales': 4,
  'Marketing': 4,
  'Design': 4,
  'General': 4,
};

const designationTitleToId: Record<string, number> = {
  'Full Stack Developer': 1,
  'Sr. Back End Developer': 1,
  'Developer': 1,
  'HR Executive': 2,
  'Accountant': 3,
  'Sales Executive': 4,
  'Sr. UI UX Designer': 1,
  'Designer': 1,
  'Project Manager': 1,
  'Team Lead': 1,
  'Staff': 4,
};

function normalizeEmployee(apiData: any): EmployeeData {
  if (!apiData) return apiData;
  return {
    ...apiData,
    id: String(apiData.id),
    dob: apiData.dob || apiData.date_of_birth || '',
    joiningDate: apiData.joiningDate || apiData.joining_date || '',
    reportingManager: apiData.reportingManager || apiData.reporting_manager || '',
    basicSalary: apiData.basicSalary || apiData.salary || '',
    status: apiData.status || 'Active',
    avatar: apiData.avatar || `https://i.pravatar.cc/150?u=${apiData.id}`,
  };
}

function denormalizeEmployee(formData: any): any {
  if (!formData) return formData;
  const apiData = { ...formData };
  
  if (formData.dob) {
    apiData.date_of_birth = formData.dob;
  }
  if (formData.joiningDate) {
    apiData.joining_date = formData.joiningDate;
  }
  if (formData.reportingManager !== undefined) {
    apiData.reporting_manager = formData.reportingManager;
  }
  if (formData.basicSalary) {
    apiData.salary = formData.basicSalary;
  }
  
  if (formData.department) {
    const deptStr = String(formData.department);
    apiData.department = departmentNameToId[deptStr] || (isNaN(Number(deptStr)) ? 1 : Number(deptStr));
  }
  if (formData.designation) {
    const desgStr = String(formData.designation);
    apiData.designation = designationTitleToId[desgStr] || (isNaN(Number(desgStr)) ? 1 : Number(desgStr));
  }
  
  return apiData;
}

export const employeeApi = {
  async getAll(page = 1, search = '', department = ''): Promise<PaginatedResponse<EmployeeData>> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    if (search) params.append('search', search);
    if (department) {
      const deptId = departmentNameToId[department] || department;
      params.append('department', String(deptId));
    }

    const response = await apiClient.get<PaginatedResponse<EmployeeData>>(`/employees/?${params.toString()}`);
    if (response.data && response.data.results) {
      response.data.results = response.data.results.map(normalizeEmployee);
    }
    return response.data;
  },

  async getById(id: string): Promise<EmployeeData> {
    const response = await apiClient.get<EmployeeData>(`/employees/${id}`);
    return normalizeEmployee(response.data);
  },

  async create(data: Partial<EmployeeData> & Record<string, unknown>): Promise<EmployeeData> {
    const apiData = denormalizeEmployee(data);
    const hasFile = Object.values(apiData).some(value => value instanceof File);
    let payload: FormData | any = apiData;
    let config = {};

    if (hasFile) {
      const formData = new FormData();
      Object.entries(apiData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(val => formData.append(key, String(val)));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      payload = formData;
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    }

    const response = await apiClient.post<EmployeeData>('/employees', payload, config);
    return normalizeEmployee(response.data);
  },

  async update(id: string, data: Partial<EmployeeData> & Record<string, unknown>): Promise<EmployeeData> {
    const apiData = denormalizeEmployee(data);
    const hasFile = Object.values(apiData).some(value => value instanceof File);
    let payload: FormData | any = apiData;
    let config = {};

    if (hasFile) {
      const formData = new FormData();
      Object.entries(apiData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(val => formData.append(key, String(val)));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      payload = formData;
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    }

    const response = await apiClient.put<EmployeeData>(`/employees/${id}`, payload, config);
    return normalizeEmployee(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },

  async getDepartments(): Promise<any[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<any>>('/departments/');
      return response.data.results || [];
    } catch (e) {
      console.error('Failed to fetch departments:', e);
      return [];
    }
  },

  async getDesignations(): Promise<any[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<any>>('/designations/');
      return response.data.results || [];
    } catch (e) {
      console.error('Failed to fetch designations:', e);
      return [];
    }
  },
};
