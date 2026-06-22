import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import styles from './Shifts.module.css';

interface ShiftAssignment {
  id: string;
  employeeName: string;
  avatar: string;
  role: string;
  schedule: { [key: string]: string }; // maps 'Mon', 'Tue', etc. to Shift text
}

const DUMMY_SHIFTS: ShiftAssignment[] = [
  {
    id: '1',
    employeeName: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?u=1',
    role: 'Backend Dev',
    schedule: { Mon: '09:00 - 17:00', Tue: '09:00 - 17:00', Wed: '09:00 - 17:00', Thu: '09:00 - 17:00', Fri: '09:00 - 17:00', Sat: 'Off', Sun: 'Off' }
  },
  {
    id: '2',
    employeeName: 'Sara John',
    avatar: 'https://i.pravatar.cc/150?u=2',
    role: 'UI/UX Designer',
    schedule: { Mon: '09:00 - 17:00', Tue: '09:00 - 17:00', Wed: 'Off', Thu: '09:00 - 17:00', Fri: '09:00 - 17:00', Sat: '10:00 - 14:00', Sun: 'Off' }
  },
  {
    id: '3',
    employeeName: 'Angel Philip',
    avatar: 'https://i.pravatar.cc/150?u=3',
    role: 'Finance Manager',
    schedule: { Mon: '09:00 - 17:00', Tue: '09:00 - 17:00', Wed: '09:00 - 17:00', Thu: '09:00 - 17:00', Fri: 'Off', Sat: 'Off', Sun: 'Off' }
  },
  {
    id: '4',
    employeeName: 'Anmariya',
    avatar: 'https://i.pravatar.cc/150?u=4',
    role: 'Mern Developer',
    schedule: { Mon: 'Off', Tue: '14:00 - 22:00', Wed: '14:00 - 22:00', Thu: '14:00 - 22:00', Fri: '14:00 - 22:00', Sat: '14:00 - 22:00', Sun: 'Off' }
  }
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Shifts() {
  const [currentWeek] = useState('June 15 - June 21, 2026');

  const getShiftClass = (shiftTime: string) => {
    if (shiftTime === 'Off') return styles.shiftOff;
    if (shiftTime.startsWith('14:00')) return styles.shiftEvening;
    return styles.shiftMorning;
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shift & Calendar</h1>

      {/* Schedule Controller Ribbon */}
      <div className={styles.toolbar}>
        <div className={styles.weekSelector}>
          <button className={styles.arrowBtn}><ChevronLeft size={18} /></button>
          <div className={styles.dateInfo}>
            <CalendarIcon size={18} />
            <span>{currentWeek}</span>
          </div>
          <button className={styles.arrowBtn}><ChevronRight size={18} /></button>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.secondaryBtn}><Filter size={16} /> Filter</button>
          <button className={styles.primaryBtn}><Plus size={16} /> Add Shift</button>
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
            {DUMMY_SHIFTS.map((member) => (
              <tr key={member.id}>
                <td className={styles.stickyColumn}>
                  <div className={styles.employeeCell}>
                    <img src={member.avatar} alt={member.employeeName} className={styles.avatar} />
                    <div className={styles.meta}>
                      <span className={styles.name}>{member.employeeName}</span>
                      <span className={styles.role}>{member.role}</span>
                    </div>
                  </div>
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const shiftTime = member.schedule[day];
                  return (
                    <td key={day}>
                      <div className={`${styles.shiftBlock} ${getShiftClass(shiftTime)}`}>
                        <Clock size={12} className={styles.clockIcon} />
                        <span>{shiftTime}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}