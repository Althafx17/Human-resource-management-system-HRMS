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

export interface ShiftTemplate {
  id: number;
  name: string; // e.g., "General Shift"
  code: string; // e.g., "GS-01"
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  break_mins: number;
  late_grace_mins: number;
  allow_overtime: boolean;
}

export interface ShiftAssignment {
  id: number;
  employee_id: number;
  shift_id: number;
  assignment_type: string;
  effective_from: string; // YYYY-MM-DD
}

export interface WeeklyOffRule {
  id: number;
  rule_name: string;
  pattern_type: string; // e.g., "Fixed (Every Week)"
  applicable_scope: string; // e.g., "Company Wide"
  active_days: string[]; // e.g., ['Sun', 'Sat']
}

export interface Holiday {
  id: number;
  name: string;
  date: string; // YYYY-MM-DD
  applicable_scope: string;
  is_optional: boolean;
}
