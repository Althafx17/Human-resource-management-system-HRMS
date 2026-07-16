import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import styles from './FormStyles.module.css';
import { employeeApi } from '../../services/employeeApi';
import type { EmployeeData } from '../../pages/employees/types';

interface LogAttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const DUMMY_LOCATIONS = [
  { id: 'Main Office', name: 'Main Office' },
  { id: 'Branch A', name: 'Branch A' },
];

export default function LogAttendanceForm({ isOpen, onClose, onSave }: LogAttendanceFormProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  // ---> CHANGED: Initialized status as an empty string
  const [status, setStatus] = useState('');
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
          while (hasMore && page <= 10) {
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
    
    // ---> NEW: Validation guard
    if (!status) {
      alert("Please select an attendance status before saving.");
      return;
    }

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
        DISCARD
      </button>
      <button 
        type="button" 
        className={styles.saveBtn} 
        onClick={handleSubmit}
      >
        <Check size={16} />
        SAVE ENTRY
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
            title="Select employee"
            aria-label="Select employee"
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
            {/* ---> CHANGED: Replaced status list with neutral disabled placeholder option */}
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              title="Select attendance status"
              aria-label="Select attendance status"
            >
              <option value="" disabled>Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
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
