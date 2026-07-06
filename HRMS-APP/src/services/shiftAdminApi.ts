// ==========================================
// 1. IMPORTS & CONFIGURATIONS
// ==========================================
import { axiosInstance } from './axiosInstance';
import type { ShiftTemplate, ShiftAssignment, WeeklyOffRule, Holiday, ResolverResponse } from '../pages/Shifts/types';

// ==========================================
// 2. MOCK STORES & LATENCY SIMULATORS
// ==========================================

const DEFAULT_WEEKLY_OFFS: WeeklyOffRule[] = [
  { id: 1, rule_name: 'Standard Weekend', pattern_type: 'Fixed (Every Week)', applicable_scope: 'Company Wide', active_days: ['Sun', 'Sat'] },
  { id: 2, rule_name: 'Mid-week Rest', pattern_type: 'Fixed (Every Week)', applicable_scope: 'Support Team', active_days: ['Wed'] },
];

const DEFAULT_HOLIDAYS: Holiday[] = [
  { id: 1, name: "New Year's Day", date: '2026-01-01', applicable_scope: 'Company Wide', is_optional: false },
  { id: 2, name: 'Good Friday', date: '2026-04-03', applicable_scope: 'Company Wide', is_optional: true },
  { id: 3, name: 'Independence Day', date: '2026-07-04', applicable_scope: 'Company Wide', is_optional: false },
];

/**
 * Loads weekly off rules from localStorage.
 */
const getStoredWeeklyOffs = (): WeeklyOffRule[] => {
  const data = localStorage.getItem('hrms_weekly_offs');
  if (!data) {
    localStorage.setItem('hrms_weekly_offs', JSON.stringify(DEFAULT_WEEKLY_OFFS));
    return DEFAULT_WEEKLY_OFFS;
  }
  return JSON.parse(data);
};

const setStoredWeeklyOffs = (offs: WeeklyOffRule[]) => {
  localStorage.setItem('hrms_weekly_offs', JSON.stringify(offs));
};

/**
 * Loads holidays from localStorage.
 */
const getStoredHolidays = (): Holiday[] => {
  const data = localStorage.getItem('hrms_holidays');
  if (!data) {
    localStorage.setItem('hrms_holidays', JSON.stringify(DEFAULT_HOLIDAYS));
    return DEFAULT_HOLIDAYS;
  }
  return JSON.parse(data);
};

const setStoredHolidays = (holidays: Holiday[]) => {
  localStorage.setItem('hrms_holidays', JSON.stringify(holidays));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 3. API SERVICE METHODS
// ==========================================

export const shiftAdminApi = {
  // ==========================================
  // SHIFT TEMPLATES CRUD (Real API via Django)
  // ==========================================
  
  /**
   * Fetches all registered shift templates from backend database.
   */
  getShifts: async (): Promise<ShiftTemplate[]> => {
    const response = await axiosInstance.get<{ results: any[] }>('/shifts/');
    const results = response.data.results || [];
    return results.map(r => ({
      id: r.id,
      name: r.name,
      code: r.code,
      start_time: r.start_time ? r.start_time.substring(0, 5) : '09:00',
      end_time: r.end_time ? r.end_time.substring(0, 5) : '18:00',
      duration_hours: r.duration_hours || 8,
      break_mins: r.break_mins || 60,
      late_grace_mins: r.late_grace_mins || 15,
      allow_overtime: r.allow_overtime || false,
    }));
  },

  /**
   * Saves a new shift template pattern.
   */
  createShift: async (data: Omit<ShiftTemplate, 'id'>): Promise<ShiftTemplate> => {
    const payload = {
      name: data.name,
      code: data.code,
      start_time: data.start_time.length === 5 ? `${data.start_time}:00` : data.start_time,
      end_time: data.end_time.length === 5 ? `${data.end_time}:00` : data.end_time,
      break_mins: data.break_mins,
      late_grace_mins: data.late_grace_mins,
      allow_overtime: data.allow_overtime,
    };
    const response = await axiosInstance.post<any>('/shifts/', payload);
    const r = response.data;
    return {
      id: r.id,
      name: r.name,
      code: r.code,
      start_time: r.start_time ? r.start_time.substring(0, 5) : '09:00',
      end_time: r.end_time ? r.end_time.substring(0, 5) : '18:00',
      duration_hours: r.duration_hours || 8,
      break_mins: r.break_mins || 60,
      late_grace_mins: r.late_grace_mins || 15,
      allow_overtime: r.allow_overtime || false,
    };
  },

  /**
   * Modifies an existing shift template.
   */
  updateShift: async (id: number, data: Partial<ShiftTemplate>): Promise<ShiftTemplate> => {
    const payload: any = {};
    if (data.name) payload.name = data.name;
    if (data.code) payload.code = data.code;
    if (data.start_time) payload.start_time = data.start_time.length === 5 ? `${data.start_time}:00` : data.start_time;
    if (data.end_time) payload.end_time = data.end_time.length === 5 ? `${data.end_time}:00` : data.end_time;
    if (data.break_mins !== undefined) payload.break_mins = data.break_mins;
    if (data.late_grace_mins !== undefined) payload.late_grace_mins = data.late_grace_mins;
    if (data.allow_overtime !== undefined) payload.allow_overtime = data.allow_overtime;

    const response = await axiosInstance.put<any>(`/shifts/${id}/`, payload);
    const r = response.data;
    return {
      id: r.id,
      name: r.name,
      code: r.code,
      start_time: r.start_time ? r.start_time.substring(0, 5) : '09:00',
      end_time: r.end_time ? r.end_time.substring(0, 5) : '18:00',
      duration_hours: r.duration_hours || 8,
      break_mins: r.break_mins || 60,
      late_grace_mins: r.late_grace_mins || 15,
      allow_overtime: r.allow_overtime || false,
    };
  },

  /**
   * Removes a shift template.
   */
  deleteShift: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/shifts/${id}/`);
  },

  // ==========================================
  // SHIFT ASSIGNMENTS CRUD (Real API via Django)
  // ==========================================

  /**
   * Fetches all registered shift assignments.
   */
  getAssignments: async (): Promise<ShiftAssignment[]> => {
    const response = await axiosInstance.get<{ results: any[] }>('/shift-assignments/');
    const results = response.data.results || [];
    return results.map(r => ({
      id: r.id,
      employee_id: r.employee,
      shift_id: r.shift,
      assignment_type: r.assignment_type || 'Temporary',
      effective_from: r.effective_from || new Date().toISOString().split('T')[0],
    }));
  },

  /**
   * Registers a new shift assignment mapping.
   */
  createAssignment: async (data: Omit<ShiftAssignment, 'id'>): Promise<ShiftAssignment> => {
    const payload = {
      employee: data.employee_id,
      shift: data.shift_id,
      assignment_type: data.assignment_type,
      effective_from: data.effective_from,
    };
    const response = await axiosInstance.post<any>('/shift-assignments/', payload);
    const r = response.data;
    return {
      id: r.id,
      employee_id: r.employee,
      shift_id: r.shift,
      assignment_type: r.assignment_type,
      effective_from: r.effective_from,
    };
  },

  /**
   * Deletes a shift assignment by ID.
   */
  deleteAssignment: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/shift-assignments/${id}/`);
  },

  // ==========================================
  // WEEKLY OFFS CRUD (Mocked API via Local Storage)
  // ==========================================
  
  getWeeklyOffs: async (): Promise<WeeklyOffRule[]> => {
    await delay(200);
    return getStoredWeeklyOffs();
  },

  createWeeklyOff: async (data: Omit<WeeklyOffRule, 'id'>): Promise<WeeklyOffRule> => {
    await delay(300);
    const offs = getStoredWeeklyOffs();
    const newId = offs.length > 0 ? Math.max(...offs.map(o => o.id)) + 1 : 1;
    const newRule: WeeklyOffRule = { ...data, id: newId };
    offs.push(newRule);
    setStoredWeeklyOffs(offs);
    return newRule;
  },

  deleteWeeklyOff: async (id: number): Promise<void> => {
    await delay(200);
    const offs = getStoredWeeklyOffs();
    const filtered = offs.filter(o => o.id !== id);
    setStoredWeeklyOffs(filtered);
  },

  // ==========================================
  // HOLIDAYS CRUD (Mocked API via Local Storage)
  // ==========================================
  
  getHolidays: async (): Promise<Holiday[]> => {
    await delay(200);
    return getStoredHolidays();
  },

  createHoliday: async (data: Omit<Holiday, 'id'>): Promise<Holiday> => {
    await delay(300);
    const holidays = getStoredHolidays();
    const newId = holidays.length > 0 ? Math.max(...holidays.map(h => h.id)) + 1 : 1;
    const newHoliday: Holiday = { ...data, id: newId };
    holidays.push(newHoliday);
    setStoredHolidays(holidays);
    return newHoliday;
  },

  deleteHoliday: async (id: number): Promise<void> => {
    await delay(200);
    const holidays = getStoredHolidays();
    const filtered = holidays.filter(h => h.id !== id);
    setStoredHolidays(filtered);
  },

  // ==========================================
  // RESOLVER TOOL (Mocked API Logic)
  // ==========================================
  
  /**
   * Resolves expected workday, holiday, or weekend states for a given employee and date.
   */
  resolveStatus: async (employeeId: number | string, date: string): Promise<ResolverResponse> => {
    await delay(400);
    
    // 1. Holiday Check
    const holidays = getStoredHolidays();
    const holidayMatch = holidays.find(h => h.date === date);
    if (holidayMatch) {
      return {
        status: 'Holiday',
        expected_hours: '0 hrs',
        assigned_shift_name: `${holidayMatch.name} (Holiday)`,
      };
    }

    // 2. Weekly Off Check
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }); // e.g. "Sun"
    const offs = getStoredWeeklyOffs();
    const isWeeklyOff = offs.some(rule => rule.active_days.includes(dayOfWeek));
    if (isWeeklyOff) {
      return {
        status: 'Weekly Off',
        expected_hours: '0 hrs',
        assigned_shift_name: 'Rest Day (Weekly Off)',
      };
    }

    // 3. Shift Assignment Match
    try {
      const response = await axiosInstance.get<{ results: any[] }>(`/shift-assignments/?employee=${employeeId}`);
      const results = response.data.results || [];
      if (results.length > 0) {
        // Sort assignments by effective_from date descending
        const activeAssignment = results
          .filter(a => a.effective_from <= date)
          .sort((a, b) => b.effective_from.localeCompare(a.effective_from))[0];

        if (activeAssignment) {
          // Fetch shift details
          const shifts = await shiftAdminApi.getShifts();
          const shiftMatch = shifts.find(s => s.id === activeAssignment.shift);
          if (shiftMatch) {
            return {
              status: 'Working Day',
              expected_hours: `${shiftMatch.duration_hours || 8} hrs`,
              assigned_shift_name: `${shiftMatch.name} (${shiftMatch.code}) ${shiftMatch.start_time} - ${shiftMatch.end_time}`,
            };
          }
        }
      }
    } catch (e) {
      console.error('Failed to resolve active shift assignment:', e);
    }

    // Default Fallback
    return {
      status: 'Working Day',
      expected_hours: '8 hrs',
      assigned_shift_name: 'General Shift (GS) 09:00 - 18:00',
    };
  }
};
