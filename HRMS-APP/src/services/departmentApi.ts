// ---> NEW: Department API services
import { axiosInstance } from './axiosInstance';

export const departmentApi = {
  /**
   * Fetches all departments from the backend.
   * Handles both paginated and flat lists.
   */
  async getAll(): Promise<any[]> {
    const response = await axiosInstance.get('/departments/');
    return response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);
  },

  /**
   * Creates a new department.
   * 
   * @param {Object} data - Payload with department name { name: string }.
   */
  async create(data: { name: string }): Promise<any> {
    const response = await axiosInstance.post('/departments/', data);
    return response.data;
  }
};
