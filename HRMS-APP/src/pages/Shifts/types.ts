// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface DailyShift {
  date: string; // YYYY-MM-DD
  start_time: string | null; // e.g., "09:00" or null if Off
  end_time: string | null;   // e.g., "17:00" or null if Off
  is_off: boolean;
}

export interface EmployeeWeeklySchedule {
  employee_id: number;
  employee_name: string;
  designation: string;
  avatar: string | null;
  shifts: DailyShift[]; // Array of 7 days (Mon-Sun)
}
