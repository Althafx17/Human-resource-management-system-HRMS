// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { axiosInstance } from './axiosInstance';

// ==========================================
// 1. TypeScript Interfaces & Type definitions
// ==========================================

export interface Shift {
  id?: number;
  name: string; // e.g. Day Shift, Night Shift
  shift_type: 'DAY' | 'NIGHT' | 'ROTATING' | 'HOLIDAY';
  start_time: string; // Format: "HH:MM:SS" or "HH:MM"
  end_time: string; // Format: "HH:MM:SS" or "HH:MM"
  late_mark_after_minutes?: number;
  is_night_shift?: boolean;
  is_rotating_shift?: boolean;
  is_holiday_shift?: boolean;
  overtime_allowed?: boolean;
}

export interface ShiftAssignment {
  id?: number;
  date: string; // Format: "YYYY-MM-DD"
  status?: string; // e.g. "Pending", "Approved"
  approved_at?: string | null;
  employee: number; // Employee database ID
  shift: number; // Shift database ID
  approved_by?: number | null; // Manager ID
}

export interface WeeklySchedule {
  id?: number;
  day_of_week: string; // e.g. "Monday", "Tuesday"
  employee: number; // Employee database ID
  shift: number; // Shift database ID
}

export interface ShiftSwapRequest {
  id?: number;
  status?: string; // "Pending", "Approved", "Rejected"
  request_date?: string; // Format: "YYYY-MM-DD"
  remarks?: string;
  approved_at?: string | null;
  requested_by: number; // Employee database ID requesting swap
  swap_with: number; // Co-worker ID to swap with
  current_shift: number; // Current shift ID
  requested_shift: number; // Target shift ID
  approved_by?: number | null; // Manager ID
}

export interface OvertimeRule {
  id?: number;
  minimum_hours: string; // decimal string, e.g. "2.00"
  overtime_rate: string; // decimal string, e.g. "1.50"
  approval_required?: boolean;
  shift: number; // Shift database ID
}

export interface Attendance {
  id?: number;
  date: string; // Format: "YYYY-MM-DD"
  check_in?: string | null; // Format: "YYYY-MM-DDTHH:MM:SSZ" (ISO)
  check_out?: string | null; // Format: "YYYY-MM-DDTHH:MM:SSZ" (ISO)
  latitude?: string | null;
  longitude?: string | null;
  is_late?: boolean;
  overtime_hours?: string; // decimal string
  is_within_geofence?: boolean;
  status: string; // "Present", "Absent", "Late"
  employee: number; // Employee database ID
  shift?: number | null; // Shift database ID
  location?: string; // Geolocation or branch area label
}

export interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
}

// ==========================================
// 2. Attendance & Shift Management API Operations
// ==========================================

export const attendanceApi = {

  // --- SHIFTS OPERATIONS (CRUD) ---

  /**
   * Fetches all configured shifts from the backend.
   */
  async getAllShifts(): Promise<PaginatedResponse<Shift>> {
    const response = await axiosInstance.get<PaginatedResponse<Shift>>('/shifts/');
    return response.data;
  },

  /**
   * Fetches details of a specific shift by its ID.
   */
  async getShiftById(id: number): Promise<Shift> {
    const response = await axiosInstance.get<Shift>(`/shifts/${id}/`);
    return response.data;
  },

  /**
   * Creates a new shift pattern (Admin/Manager authorization required).
   */
  async createShift(data: Shift): Promise<Shift> {
    const response = await axiosInstance.post<Shift>('/shifts/', data);
    return response.data;
  },

  /**
   * Updates an existing shift details by ID.
   */
  async updateShift(id: number, data: Partial<Shift>): Promise<Shift> {
    const response = await axiosInstance.put<Shift>(`/shifts/${id}/`, data);
    return response.data;
  },

  /**
   * Deletes a shift pattern by ID.
   */
  async deleteShift(id: number): Promise<void> {
    await axiosInstance.delete(`/shifts/${id}/`);
  },

  // --- SHIFT ASSIGNMENTS (DATED SHIFTS) ---

  /**
   * Fetches specific dates shift assignments, filtered by employee or date.
   */
  async getAssignments(employeeId?: number, date?: string): Promise<PaginatedResponse<ShiftAssignment>> {
    const params = new URLSearchParams();
    if (employeeId) params.append('employee', String(employeeId));
    if (date) params.append('date', date);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get<PaginatedResponse<ShiftAssignment>>(`/shift-assignments/${query}`);
    return response.data;
  },

  /**
   * Assigns a specific shift to an employee for a specific date range.
   */
  async createAssignment(data: ShiftAssignment): Promise<ShiftAssignment> {
    const response = await axiosInstance.post<ShiftAssignment>('/shift-assignments/', data);
    return response.data;
  },

  /**
   * Removes a date-based shift assignment.
   */
  async deleteAssignment(id: number): Promise<void> {
    await axiosInstance.delete(`/shift-assignments/${id}/`);
  },

  // --- WEEKLY SCHEDULES (RECURRING SCHEDULES) ---

  /**
   * Fetches the recurring weekly schedules.
   */
  async getWeeklySchedules(employeeId?: number): Promise<PaginatedResponse<WeeklySchedule>> {
    const query = employeeId ? `?employee=${employeeId}` : '';
    const response = await axiosInstance.get<PaginatedResponse<WeeklySchedule>>(`/weekly-schedules/${query}`);
    return response.data;
  },

  /**
   * Creates a recurring weekly schedule for an employee (e.g. Day Shift on Mondays).
   */
  async createWeeklySchedule(data: WeeklySchedule): Promise<WeeklySchedule> {
    const response = await axiosInstance.post<WeeklySchedule>('/weekly-schedules/', data);
    return response.data;
  },

  /**
   * Deletes a weekly schedule assignment.
   */
  async deleteWeeklySchedule(id: number): Promise<void> {
    await axiosInstance.delete(`/weekly-schedules/${id}/`);
  },

  // --- SHIFT SWAPPING REQUESTS ---

  /**
   * Lists all coworker swap requests submitted in the organization.
   */
  async getSwapRequests(): Promise<PaginatedResponse<ShiftSwapRequest>> {
    const response = await axiosInstance.get<PaginatedResponse<ShiftSwapRequest>>('/shift-swap-requests/');
    return response.data;
  },

  /**
   * Submits a new swap request from an employee to a coworker.
   */
  async createSwapRequest(data: ShiftSwapRequest): Promise<ShiftSwapRequest> {
    const response = await axiosInstance.post<ShiftSwapRequest>('/shift-swap-requests/', data);
    return response.data;
  },

  /**
   * Updates status of a shift swap request (Manager Approvals/Rejections).
   */
  async updateSwapRequestStatus(id: number, status: 'Approved' | 'Rejected', managerId: number): Promise<ShiftSwapRequest> {
    const response = await axiosInstance.patch<ShiftSwapRequest>(`/shift-swap-requests/${id}/`, {
      status,
      approved_by: managerId,
      approved_at: new Date().toISOString()
    });
    return response.data;
  },

  // --- OVERTIME CONFIGURATION ---

  /**
   * Lists all overtime rules.
   */
  async getOvertimeRules(): Promise<PaginatedResponse<OvertimeRule>> {
    const response = await axiosInstance.get<PaginatedResponse<OvertimeRule>>('/overtime-rules/');
    return response.data;
  },

  /**
   * Creates a new overtime rule.
   */
  async createOvertimeRule(data: OvertimeRule): Promise<OvertimeRule> {
    const response = await axiosInstance.post<OvertimeRule>('/overtime-rules/', data);
    return response.data;
  },

  /**
   * Updates an overtime rule by ID.
   */
  async updateOvertimeRule(id: number, data: Partial<OvertimeRule>): Promise<OvertimeRule> {
    const response = await axiosInstance.put<OvertimeRule>(`/overtime-rules/${id}/`, data);
    return response.data;
  },

  /**
   * Deletes an overtime rule.
   */
  async deleteOvertimeRule(id: number): Promise<void> {
    await axiosInstance.delete(`/overtime-rules/${id}/`);
  },

  // --- ATTENDANCE TRACKING AND LOGGING ---

  /**
   * Fetches attendance log records. Supports optional filtering by employee or date.
   */
  async getAttendanceRecords(employeeId?: number, date?: string): Promise<PaginatedResponse<Attendance>> {
    const params = new URLSearchParams();
    if (employeeId) params.append('employee', String(employeeId));
    if (date) params.append('date', date);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get<PaginatedResponse<Attendance>>(`/attendances/${query}`);
    return response.data;
  },

  /**
   * Logs a new attendance check-in/check-out entry.
   */
  async logAttendance(data: Attendance): Promise<Attendance> {
    const response = await axiosInstance.post<Attendance>('/attendances/', data);
    return response.data;
  },

  /**
   * Updates an existing attendance entry (e.g. logging a check-out).
   */
  async updateAttendance(id: number, data: Partial<Attendance>): Promise<Attendance> {
    const response = await axiosInstance.put<Attendance>(`/attendances/${id}/`, data);
    return response.data;
  },

  /**
   * Deletes an attendance record by ID.
   */
  async deleteAttendance(id: number): Promise<void> {
    await axiosInstance.delete(`/attendances/${id}/`);
  }
};
