// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { axiosInstance } from './axiosInstance';
import type { EmployeeData } from '../pages/employees/types';
import { getDeterministicMaleAvatar } from '../utils/avatarUtils';

// ==========================================
// 2. TYPES & INTERFACES
// ==========================================

/**
 * Interface representing a standard paginated response envelope from the Django REST API.
 */
interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// ==========================================
// 3. UTILITIES & NORMALIZERS
// ==========================================

// Mappings for UI string values to backend primary key IDs
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

// Global cache populated during fetch to map employee names back to primary keys
const nameToIdCache: Record<string, number> = {};

/**
 * Normalizes backend raw employee records into UI-compatible camelCase models.
 * Also seeds nameToIdCache mapping and generates a deterministic male profile picture.
 * 
 * @param {any} apiData - Raw employee object returned from the backend.
 * @returns {EmployeeData} Normalized employee data for frontend components.
 */
function normalizeEmployee(apiData: any): EmployeeData {
  if (!apiData) return apiData;
  
  // Seed the cache with the name to PK ID mapping
  if (apiData.name && apiData.id) {
    nameToIdCache[apiData.name] = Number(apiData.id);
  }

  return {
    ...apiData,
    id: String(apiData.id),
    dob: apiData.dob || apiData.date_of_birth || '',
    joiningDate: apiData.joiningDate || apiData.joining_date || '',
    reportingManager: apiData.reportingManager || apiData.reporting_manager || '',
    basicSalary: apiData.basicSalary || apiData.salary || '',
    status: apiData.status || 'Active',
    avatar: apiData.avatar || getDeterministicMaleAvatar(apiData.id),
  };
}

/**
 * Denormalizes frontend camelCase employee models back into backend snake_case parameters.
 * Automatically translates nested relation names (e.g. manager, department) back into integers.
 * 
 * @param {any} formData - Employee form details from the UI state.
 * @returns {any} Denormalized object suitable for POST/PUT payloads.
 */
function denormalizeEmployee(formData: any): any {
  if (!formData) return formData;
  const apiData = { ...formData };
  
  // Map dob and joiningDate properties to date_of_birth and joining_date
  if (formData.dob) {
    apiData.date_of_birth = formData.dob;
  }
  if (formData.joiningDate) {
    apiData.joining_date = formData.joiningDate;
  }
  
  // Handle manager relations mapping. Converts manager name string or blank values safely
  if (formData.reportingManager !== undefined) {
    const managerVal = formData.reportingManager;
    if (managerVal === '' || managerVal === 'No Manager' || managerVal === null) {
      apiData.reporting_manager = null;
    } else if (!isNaN(Number(managerVal)) && String(managerVal).trim() !== '') {
      apiData.reporting_manager = Number(managerVal);
    } else {
      // Lookup manager ID from cache if a text name string was passed
      apiData.reporting_manager = nameToIdCache[managerVal] || null;
    }
  }
  if (formData.basicSalary) {
    apiData.salary = formData.basicSalary;
  }
  
  // Map department and designation titles back to backend PK IDs
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

// ==========================================
// 4. MAIN SERVICE OPERATIONS (CRUD)
// ==========================================

export const employeeApi = {
  /**
   * Fetches paginated employee list with optional name search and department filters.
   * 
   * @param {number} [page=1] - The page number to fetch.
   * @param {string} [search=''] - Term to filter employees by name.
   * @param {string} [department=''] - Department filter.
   * @returns {Promise<PaginatedResponse<EmployeeData>>} Paginated employee records.
   */
  async getAll(page = 1, search = '', department = ''): Promise<PaginatedResponse<EmployeeData>> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    if (search) params.append('search', search);
    if (department) {
      const deptId = departmentNameToId[department] || department;
      params.append('department', String(deptId));
    }

    const response = await axiosInstance.get<PaginatedResponse<EmployeeData>>(`/employees/?${params.toString()}`);
    if (response.data && response.data.results) {
      response.data.results = response.data.results.map(normalizeEmployee);
    }
    return response.data;
  },

  /**
   * Fetches detailed data for a specific employee.
   * Note: Django backend expects a trailing slash at the end of the URL path.
   * 
   * @param {string} id - The database ID of the employee.
   * @returns {Promise<EmployeeData>} Normalized employee record details.
   */
  async getById(id: string): Promise<EmployeeData> {
    const response = await axiosInstance.get<EmployeeData>(`/employees/${id}/`);
    return normalizeEmployee(response.data);
  },

  /**
   * Registers a new employee in the backend system.
   * Handles multipart/form-data payload wrapping if the avatar file attachment is present.
   * 
   * @param {Partial<EmployeeData>} data - Form fields payload.
   * @returns {Promise<EmployeeData>} Created employee record details.
   */
  async create(data: Partial<EmployeeData> & Record<string, unknown>): Promise<EmployeeData> {
    const apiData = denormalizeEmployee(data);
    const hasFile = Object.values(apiData).some(value => value instanceof File);
    let payload: FormData | any = apiData;
    let config = {};

    // Assemble form data envelope if uploading image files
    if (hasFile) {
      const formData = new FormData();
      Object.entries(apiData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(val => formData.append(key, String(val)));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            // Guard: If value is an existing avatar URL string, skip appending it to FormData
            if (key === 'avatar' && typeof value === 'string' && value.startsWith('http')) {
              return;
            }
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

    const response = await axiosInstance.post<EmployeeData>('/employees/', payload, config);
    return normalizeEmployee(response.data);
  },

  /**
   * Updates an existing employee profile details.
   * Note: Django backend expects a trailing slash at the end of the URL path.
   * 
   * @param {string} id - The database ID of the employee to modify.
   * @param {Partial<EmployeeData>} data - Fields payload with modifications.
   * @returns {Promise<EmployeeData>} Updated employee record details.
   */
  async update(id: string, data: Partial<EmployeeData> & Record<string, unknown>): Promise<EmployeeData> {
    const apiData = denormalizeEmployee(data);
    const hasFile = Object.values(apiData).some(value => value instanceof File);
    let payload: FormData | any = apiData;
    let config = {};

    // Assemble form data envelope if uploading image files
    if (hasFile) {
      const formData = new FormData();
      Object.entries(apiData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(val => formData.append(key, String(val)));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            // Guard: If value is an existing avatar URL string, skip appending it to FormData
            if (key === 'avatar' && typeof value === 'string' && value.startsWith('http')) {
              return;
            }
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

    const response = await axiosInstance.put<EmployeeData>(`/employees/${id}/`, payload, config);
    return normalizeEmployee(response.data);
  },

  /**
   * Deletes an employee profile from the system.
   * Note: Django backend expects a trailing slash at the end of the URL path.
   * 
   * @param {string} id - The database ID of the employee.
   * @returns {Promise<void>} Resolves when delete operation is successful.
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/employees/${id}/`);
  },

  /**
   * Fetches list of available departments options.
   * 
   * @returns {Promise<any[]>} List of department objects.
   */
  async getDepartments(): Promise<any[]> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<any>>('/departments/');
      return response.data.results || [];
    } catch (e) {
      console.error('Failed to fetch departments:', e);
      return [];
    }
  },

  /**
   * Fetches list of available designations options.
   * 
   * @returns {Promise<any[]>} List of designation objects.
   */
  async getDesignations(): Promise<any[]> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<any>>('/designations/');
      return response.data.results || [];
    } catch (e) {
      console.error('Failed to fetch designations:', e);
      return [];
    }
  },
};
