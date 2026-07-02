// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { employeeApi } from './employeeApi';
import { attendanceApi } from './attendanceApi';
import type { EmployeeWeeklySchedule, DailyShift } from '../pages/Shifts/types';

// ==========================================
// 2. ORCHESTRATION SERVICE
// ==========================================

export const scheduleApi = {
  /**
   * Fetches and compiles the weekly shift schedule for all active employees.
   * Resolves dated assignments and shift details on the client side.
   * 
   * @param {string} weekStartDate - Starting Monday of the week in YYYY-MM-DD format.
   * @returns {Promise<EmployeeWeeklySchedule[]>} Array of resolved employee schedules.
   */
  getCompanyWeeklySchedule: async (weekStartDate: string): Promise<EmployeeWeeklySchedule[]> => {
    // 1. Fetch all active employee records
    let employeesList: any[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 5) {
      const data = await employeeApi.getAll(page);
      if (data.results && data.results.length > 0) {
        employeesList = [...employeesList, ...data.results];
        hasMore = !!data.next;
        page++;
      } else {
        hasMore = false;
      }
    }

    // 2. Fetch all shift templates to resolve start/end times
    const shiftsData = await attendanceApi.getAllShifts();
    const shiftTemplates = shiftsData.results || [];
    const shiftMap: Record<number, any> = {};
    shiftTemplates.forEach(s => {
      if (s.id) shiftMap[s.id] = s;
    });

    // 3. Generate the 7 dates for the week starting from weekStartDate
    const dates: string[] = [];
    const baseDate = new Date(weekStartDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // 4. Fetch assignments for each date in parallel
    const assignmentsPromises = dates.map(date => attendanceApi.getAssignments(undefined, date));
    const assignmentsResults = await Promise.all(assignmentsPromises);

    // Build assignment map by employee ID and date: assignmentMap[employee_id][date] = ShiftAssignment
    const assignmentMap: Record<string, Record<string, any>> = {};
    dates.forEach((date, index) => {
      const dayAssignments = assignmentsResults[index].results || [];
      dayAssignments.forEach(asg => {
        const empId = String(asg.employee);
        if (!assignmentMap[empId]) {
          assignmentMap[empId] = {};
        }
        assignmentMap[empId][date] = asg;
      });
    });

    // 5. Build EmployeeWeeklySchedule for each employee
    const weeklySchedules: EmployeeWeeklySchedule[] = employeesList.map(emp => {
      const empIdStr = String(emp.id);
      const empAssignments = assignmentMap[empIdStr] || {};

      const dailyShifts: DailyShift[] = dates.map(date => {
        const assignment = empAssignments[date];
        if (assignment) {
          const shiftTemplate = shiftMap[Number(assignment.shift)];
          if (shiftTemplate) {
            // Trim seconds from start_time and end_time (e.g. "09:00:00" -> "09:00")
            const trimTime = (t: string) => t.substring(0, 5);
            return {
              date,
              start_time: trimTime(shiftTemplate.start_time),
              end_time: trimTime(shiftTemplate.end_time),
              is_off: false
            };
          }
        }
        return {
          date,
          start_time: null,
          end_time: null,
          is_off: true
        };
      });

      return {
        employee_id: Number(emp.id),
        employee_name: emp.name,
        designation: emp.designation,
        avatar: typeof emp.avatar === 'string' ? emp.avatar : null,
        shifts: dailyShifts
      };
    });

    return weeklySchedules;
  }
};
