import { axiosInstance } from '../config/axiosInstance';

export interface ExpenseClaim {
  id: string | number;
  date: string;
  category: 'Travel' | 'Meals' | 'Supplies' | 'Other';
  amount: number;
  description: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ExpensePayload {
  employee: number;
  date: string;
  category: 'Travel' | 'Meals' | 'Supplies' | 'Other';
  amount: number;
  description: string;
  status: string;
  receipt?: File | string | null;
}

export const expenseApi = {
  /**
   * Fetches all expense claims.
   * Target endpoint: GET /api/expenses/
   */
  async getExpenses(): Promise<ExpenseClaim[]> {
    try {
      const response = await axiosInstance.get('/expenses/');
      const results = response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);
      return results;
    } catch (e) {
      console.warn("Expenses endpoint failed or not active, returning empty list.", e);
      return [];
    }
  },

  /**
   * Submits/Creates a new expense claim.
   * Target endpoint: POST /api/expenses/
   */
  async submitExpense(payload: ExpensePayload): Promise<ExpenseClaim> {
    const hasFile = payload.receipt instanceof File;
    let requestPayload: FormData | any = payload;
    let config = {};

    if (hasFile) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      requestPayload = formData;
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    }

    const response = await axiosInstance.post('/expenses/', requestPayload, config);
    return response.data;
  },

  // --- Retroactive Compatibility Fallbacks ---
  async getAll(): Promise<any[]> {
    return this.getExpenses();
  },

  async create(data: any): Promise<any> {
    return this.submitExpense(data);
  },

  async getById(id: string | number): Promise<any> {
    const response = await axiosInstance.get(`/expenses/${id}/`);
    return response.data;
  },

  async update(id: string | number, data: any): Promise<any> {
    const response = await axiosInstance.put(`/expenses/${id}/`, data);
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await axiosInstance.delete(`/expenses/${id}/`);
  },

  async getPendingExpenses(): Promise<ExpenseClaim[]> {
    try {
      const response = await axiosInstance.get('/expenses/');
      const results = response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);
      return results.filter((c: any) => c.status === 'Pending');
    } catch (e) {
      console.warn("getPendingExpenses failed, returning empty list.", e);
      return [];
    }
  },

  async updateExpenseStatus(id: number | string, status: 'Approved' | 'Rejected'): Promise<ExpenseClaim> {
    const response = await axiosInstance.patch(`/expenses/${id}/`, { status });
    return response.data;
  }
};
