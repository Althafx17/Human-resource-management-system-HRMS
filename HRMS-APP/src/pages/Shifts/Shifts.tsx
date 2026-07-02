// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import styles from './Shifts.module.css';
import ShiftTemplateForm from '../../components/ShiftTemplateForm';
import { scheduleApi } from '../../services/scheduleApi';
import { getDeterministicMaleAvatar } from '../../utils/avatarUtils';
import type { EmployeeWeeklySchedule } from './types';

// ==========================================
// 2. HELPERS & FORMATTERS
// ==========================================

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Calculates the calendar date of the Monday of the current week.
 * 
 * @param {Date} date - The starting reference date.
 * @returns {Date} Mon day date object.
 */
const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Formats a Monday start date into a display string range (e.g., "Jun 15 - Jun 21, 2026").
 */
const formatWeekRange = (mondayStr: string): string => {
  const monday = new Date(mondayStr);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const monStr = monday.toLocaleDateString('en-US', options);
  const sunStr = sunday.toLocaleDateString('en-US', options);
  const year = monday.getFullYear();
  
  return `${monStr} - ${sunStr}, ${year}`;
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

/**
 * Shifts Component (Default Export)
 * 
 * Renders the weekly shifts planner roster table, integrating real assignments
 * from the database and supporting pagination forward/backward across calendar weeks.
 */
export default function Shifts() {
  // Navigation drawer and loading indicators
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Default to the Monday date string of the current week
  const [weekStartDate, setWeekStartDate] = useState<string>(
    getMonday(new Date()).toISOString().split('T')[0]
  );
  
  // Weekly schedules state
  const [schedules, setSchedules] = useState<EmployeeWeeklySchedule[]>([]);

  // Fetch the company's weekly schedule on weekStartDate or cache updates
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const data = await scheduleApi.getCompanyWeeklySchedule(weekStartDate);
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch weekly schedules", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, [weekStartDate]);

  /**
   * Helper mapping shift times to different accent color CSS classes.
   */
  const getShiftClass = (shiftTime: string) => {
    if (shiftTime === 'Off') return styles.shiftOff;
    // Highlight evening shifts (typically starting at 14:00/2pm or later)
    if (shiftTime.startsWith('14:') || shiftTime.startsWith('15:') || shiftTime.startsWith('16:')) {
      return styles.shiftEvening;
    }
    return styles.shiftMorning;
  };

  // Navigates 7 days backward
  const handlePrevWeek = () => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() - 7);
    setWeekStartDate(d.toISOString().split('T')[0]);
  };

  // Navigates 7 days forward
  const handleNextWeek = () => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + 7);
    setWeekStartDate(d.toISOString().split('T')[0]);
  };

  // Callback mock for shift templates creation
  const handleSave = (data: any) => {
    alert(`Shift Template Created!\nName: ${data.shiftName}\nCode: ${data.shiftCode}\nTime: ${data.startTime} - ${data.endTime}`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shift & Calendar</h1>

      {/* Schedule Controller Ribbon */}
      <div className={styles.toolbar}>
        <div className={styles.weekSelector}>
          <button 
            type="button" 
            className={styles.arrowBtn} 
            onClick={handlePrevWeek}
            aria-label="Previous week"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className={styles.dateInfo}>
            <CalendarIcon size={18} />
            <span>{formatWeekRange(weekStartDate)}</span>
          </div>
          
          <button 
            type="button" 
            className={styles.arrowBtn} 
            onClick={handleNextWeek}
            aria-label="Next week"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.secondaryBtn} type="button"><Filter size={16} /> Filter</button>
          <button 
            type="button"
            className={styles.primaryBtn}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Plus size={16} /> Add Shift
          </button>
        </div>
      </div>

      {/* Schedule Roster Grid Table */}
      <div className={styles.calendarWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.stickyColumn}>Employee</th>
              {DAYS_OF_WEEK.map(day => (
                <th key={day} className={styles.centerHeader}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  Loading schedule details...
                </td>
              </tr>
            ) : schedules.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No employee schedules available.
                </td>
              </tr>
            ) : (
              schedules.map((member) => (
                <tr key={member.employee_id}>
                  <td className={styles.stickyColumn}>
                    <div className={styles.employeeCell}>
                      <img 
                        src={member.avatar || getDeterministicMaleAvatar(member.employee_id)} 
                        alt={member.employee_name} 
                        className={styles.avatar} 
                      />
                      <div className={styles.meta}>
                        <span className={styles.name}>{member.employee_name}</span>
                        <span className={styles.role}>{member.designation || 'General Staff'}</span>
                      </div>
                    </div>
                  </td>
                  {member.shifts.map((dayShift, idx) => {
                    const shiftText = dayShift.is_off 
                      ? 'Off' 
                      : `${dayShift.start_time} - ${dayShift.end_time}`;
                    return (
                      <td key={idx}>
                        <div className={`${styles.shiftBlock} ${getShiftClass(shiftText)}`}>
                          <Clock size={12} className={styles.clockIcon} />
                          <span>{shiftText}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slideout Add Shift Template Drawer */}
      <ShiftTemplateForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}