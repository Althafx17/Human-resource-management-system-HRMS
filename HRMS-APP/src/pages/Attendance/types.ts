// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

/**
 * Interface representing a resolved, display-ready attendance record on the frontend.
 * Combines raw attendance log dates and check times with resolved employee profiles.
 */
export interface AttendanceRecord {
  id: number;
  name: string;
  avatar: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | string;
  location: string; // <-- New field
}
