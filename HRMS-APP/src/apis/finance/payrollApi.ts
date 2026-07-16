// ---> CHANGED: Connect to correct payrolls API endpoint
import { axiosInstance } from '../config/axiosInstance';

export const payrollApi = {
  /**
   * Fetches all payroll records from the backend.
   * Target endpoint: GET /api/payrolls/
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/payrolls/');
      return response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.warn("Backend payrolls failed or empty:", e);
      return [];
    }
  },

  /**
   * Fetches a specific payroll record by ID.
   * Target endpoint: GET /api/payrolls/{id}/
   */
  async getById(id: string | number): Promise<any> {
    const response = await axiosInstance.get(`/payrolls/${id}/`);
    return response.data;
  },

  /**
   * Generates/Creates a new payroll record.
   * Target endpoint: POST /api/payrolls/
   */
  async create(data: any): Promise<any> {
    const response = await axiosInstance.post('/payrolls/', data);
    return response.data;
  },

  /**
   * Updates an existing payroll record.
   * Target endpoint: PUT /api/payrolls/{id}/
   */
  async update(id: string | number, data: any): Promise<any> {
    const response = await axiosInstance.put(`/payrolls/${id}/`, data);
    return response.data;
  },

  /**
   * Deletes a payroll record.
   * Target endpoint: DELETE /api/payrolls/{id}/
   */
  async delete(id: string | number): Promise<void> {
    await axiosInstance.delete(`/payrolls/${id}/`);
  }
};
