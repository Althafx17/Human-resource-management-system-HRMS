import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import SlideOverDrawer from './SlideOverDrawer';
import styles from './FormStyles.module.css';
import { employeeApi } from '../services/employeeApi';
import type { EmployeeData } from '../pages/employees/types';

interface LogAttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const DUMMY_LOCATIONS = [
  { id: 'HQ', name: 'Headquarters - Floor 3' },
  { id: 'DS', name: 'Design Studio - London' },
  { id: 'RD', name: 'R&D Engineering Lab - California' },
  { id: 'REM', name: 'Remote' },
];

export default function LogAttendanceForm({ isOpen, onClose, onSave }: LogAttendanceFormProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Present');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [location, setLocation] = useState('');
  const [employees, setEmployees] = useState<EmployeeData[]>([]);

  // Load employee list on mount / drawer display
  useEffect(() => {
    if (isOpen) {
      const loadEmployees = async () => {
        try {
          let list: EmployeeData[] = [];
          let page = 1;
          let hasMore = true;
          while (hasMore && page <= 5) {
            const data = await employeeApi.getAll(page);
            if (data.results && data.results.length > 0) {
              list = [...list, ...data.results];
              hasMore = !!data.next;
              page++;
            } else {
              hasMore = false;
            }
          }
          setEmployees(list);
        } catch (e) {
          console.error('Failed to load employees for attendance:', e);
        }
      };
      loadEmployees();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !date || !location) {
      alert('Please fill in all required fields.');
      return;
    }
    if (onSave) {
      onSave({
        employeeId,
        date,
        status,
        checkIn: status === 'Absent' ? '--' : checkIn,
        checkOut: status === 'Absent' ? '--' : checkOut,
        location,
      });
    }
    onClose();
  };

  const footerActions = (
    <>
      <button 
        type="button" 
        className={styles.discardBtn} 
        onClick={onClose}
      >
        Discard
      </button>
      <button 
        type="button" 
        className={styles.saveBtn} 
        onClick={handleSubmit}
      >
        <Check size={16} />
        Save Entry
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Log Attendance"
      subtitle="Create a manual attendance entry for an employee"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Employee Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Employee *</label>
          <select
            className={styles.select}
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Status Grid */}
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Date *</label>
            <input
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Status *</label>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        {/* Check In and Check Out Grid */}
        {status !== 'Absent' && (
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Check In Time</label>
              <input
                type="time"
                className={styles.input}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Check Out Time</label>
              <input
                type="time"
                className={styles.input}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Location Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Location *</label>
          <select
            className={styles.select}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select Location</option>
            {DUMMY_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </SlideOverDrawer>
  );
}
