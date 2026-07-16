// ---> CHANGED: Connect to correct overtime-rules API endpoint
import { axiosInstance } from '../config/axiosInstance';

export const overtimeApi = {
  /**
   * Fetches all overtime logs from the backend.
   * Target endpoint: GET /api/overtime-rules/
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/overtime-rules/');
      return response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.warn("Backend overtime-rules failed or empty:", e);
      return [];
    }
  },

  /**
   * Fetches a specific overtime log by ID.
   * Target endpoint: GET /api/overtime-rules/{id}/
   */
  async getById(id: string | number): Promise<any> {
    const response = await axiosInstance.get(`/overtime-rules/${id}/`);
    return response.data;
  },

  /**
   * Logs/Creates a new overtime request.
   * Target endpoint: POST /api/overtime-rules/
   */
  async create(data: any): Promise<any> {
    const response = await axiosInstance.post('/overtime-rules/', data);
    return response.data;
  },

  /**
   * Updates an existing overtime request.
   * Target endpoint: PUT /api/overtime-rules/{id}/
   */
  async update(id: string | number, data: any): Promise<any> {
    const response = await axiosInstance.put(`/overtime-rules/${id}/`, data);
    return response.data;
  },

  /**
   * Deletes an overtime log.
   * Target endpoint: DELETE /api/overtime-rules/{id}/
   */
  async delete(id: string | number): Promise<void> {
    await axiosInstance.delete(`/overtime-rules/${id}/`);
  }
};
