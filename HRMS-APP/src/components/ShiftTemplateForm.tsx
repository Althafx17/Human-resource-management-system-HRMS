import React, { useState } from 'react';
import SlideOverDrawer from './SlideOverDrawer';
import styles from './FormStyles.module.css';

interface ShiftTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function ShiftTemplateForm({ isOpen, onClose, onSave }: ShiftTemplateFormProps) {
  const [shiftName, setShiftName] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakMins, setBreakMins] = useState('60');
  const [lateGrace, setLateGrace] = useState('15');
  const [allowOvertime, setAllowOvertime] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftName || !shiftCode || !startTime || !endTime) {
      alert('Please fill in all required fields.');
      return;
    }
    if (onSave) {
      onSave({
        shiftName,
        shiftCode,
        startTime,
        endTime,
        breakMins: parseInt(breakMins, 10),
        lateGrace: parseInt(lateGrace, 10),
        allowOvertime,
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
        Cancel
      </button>
      <button 
        type="button" 
        className={styles.saveBtn} 
        onClick={handleSubmit}
      >
        Save Shift
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Shift Template"
      subtitle="Define a recurring work shift schedule template"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Shift Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Shift Name *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Standard Morning Shift"
            value={shiftName}
            onChange={(e) => setShiftName(e.target.value)}
            required
          />
        </div>

        {/* Shift Code */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Shift Code *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. MORNING_STD"
            value={shiftCode}
            onChange={(e) => setShiftCode(e.target.value)}
            required
          />
        </div>

        {/* Start Time & End Time */}
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Start Time *</label>
            <input
              type="time"
              className={styles.input}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>End Time *</label>
            <input
              type="time"
              className={styles.input}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Break and Late Grace */}
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Break Duration (Mins) *</label>
            <input
              type="number"
              className={styles.input}
              value={breakMins}
              onChange={(e) => setBreakMins(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Late Grace Period (Mins) *</label>
            <input
              type="number"
              className={styles.input}
              value={lateGrace}
              onChange={(e) => setLateGrace(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Allow Overtime Checkbox */}
        <div className={styles.formGroup}>
          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={allowOvertime}
              onChange={(e) => setAllowOvertime(e.target.checked)}
            />
            <span className={styles.checkboxLabel}>Allow Overtime logging for this shift</span>
          </label>
        </div>

      </form>
    </SlideOverDrawer>
  );
}
