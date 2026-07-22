import { axiosInstance } from '../config/axiosInstance';

export const leaveApi = {
  /**
   * Fetches all leave requests from the backend.
   * Target endpoint: GET /api/leave-applications/
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/leave-applications/');
      return response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.warn("Backend leave-applications failed or empty:", e);
      return [];
    }
  },

  /**
   * Fetches a specific leave request by ID.
   * Target endpoint: GET /api/leave-applications/{id}/
   */
  async getById(id: string | number): Promise<any> {
    const response = await axiosInstance.get(`/leave-applications/${id}/`);
    return response.data;
  },

  /**
   * Submits/Creates a new leave request.
   * Target endpoint: POST /api/leave-applications/
   */
  async create(data: any): Promise<any> {
    const response = await axiosInstance.post('/leave-applications/', data);
    return response.data;
  },

  /**
   * Updates an existing leave request.
   * Target endpoint: PUT /api/leave-applications/{id}/
   */
  async update(id: string | number, data: any): Promise<any> {
    const response = await axiosInstance.put(`/leave-applications/${id}/`, data);
    return response.data;
  },

  /**
   * Deletes a leave request.
   * Target endpoint: DELETE /api/leave-applications/{id}/
   */
  async delete(id: string | number): Promise<void> {
    await axiosInstance.delete(`/leave-applications/${id}/`);
  },

  async getLeaveRequests(): Promise<any[]> {
    return this.getAll();
  },

  async applyLeave(payload: any): Promise<any> {
    return this.create(payload);
  },

  async updateLeaveStatus(id: string | number, status: 'Approved' | 'Rejected'): Promise<any> {
    const response = await axiosInstance.patch(`/leave-applications/${id}/`, { status });
    return response.data;
  }
};
