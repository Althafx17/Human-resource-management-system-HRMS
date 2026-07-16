// ---> CHANGED: Connect to expense API endpoint with empty list fallbacks
import { axiosInstance } from '../config/axiosInstance';

export const expenseApi = {
  /**
   * Fetches all expense claims from the backend.
   * Note: The current backend does not expose an expenses endpoint. Falls back to empty list gracefully.
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/expenses/');
      return response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.warn("Expenses endpoint not found on backend. Returning empty array.", e);
      return [];
    }
  },

  /**
   * Fetches a specific expense claim by ID.
   */
  async getById(id: string | number): Promise<any> {
    try {
      const response = await axiosInstance.get(`/expenses/${id}/`);
      return response.data;
    } catch (e) {
      console.warn(`Failed to fetch expense ID ${id}:`, e);
      return null;
    }
  },

  /**
   * Submits/Creates a new expense claim.
   */
  async create(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/expenses/', data);
      return response.data;
    } catch (e) {
      console.error("Failed to create expense claim:", e);
      throw e;
    }
  },

  /**
   * Updates an existing expense claim.
   */
  async update(id: string | number, data: any): Promise<any> {
    try {
      const response = await axiosInstance.put(`/expenses/${id}/`, data);
      return response.data;
    } catch (e) {
      console.error(`Failed to update expense ID ${id}:`, e);
      throw e;
    }
  },

  /**
   * Deletes an expense claim.
   */
  async delete(id: string | number): Promise<void> {
    try {
      await axiosInstance.delete(`/expenses/${id}/`);
    } catch (e) {
      console.error(`Failed to delete expense ID ${id}:`, e);
      throw e;
    }
  }
};
