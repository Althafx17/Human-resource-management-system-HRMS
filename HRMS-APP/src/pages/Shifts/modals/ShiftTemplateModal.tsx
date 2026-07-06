// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import React, { useState, useEffect } from 'react';
import SlideOverDrawer from '../../../components/SlideOverDrawer';
import styles from '../../../components/FormStyles.module.css';
import type { ShiftTemplate } from '../types';

// ==========================================
// 2. TYPES & PROPS
// ==========================================
interface ShiftTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ShiftTemplate, 'id'>) => void;
  initialData?: ShiftTemplate | null;
}

// ==========================================
// 3. MAIN MODAL COMPONENT
// ==========================================
export default function ShiftTemplateModal({ isOpen, onClose, onSave, initialData }: ShiftTemplateModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [breakMins, setBreakMins] = useState('60');
  const [lateGraceMins, setLateGraceMins] = useState('15');
  const [allowOvertime, setAllowOvertime] = useState(false);

  // Sync state variables with edit fields when opening drawer
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setCode(initialData.code);
        setStartTime(initialData.start_time);
        setEndTime(initialData.end_time);
        setBreakMins(String(initialData.break_mins));
        setLateGraceMins(String(initialData.late_grace_mins));
        setAllowOvertime(initialData.allow_overtime);
      } else {
        setName('');
        setCode('');
        setStartTime('09:00');
        setEndTime('18:00');
        setBreakMins('60');
        setLateGraceMins('15');
        setAllowOvertime(false);
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !startTime || !endTime) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave({
      name,
      code,
      start_time: startTime,
      end_time: endTime,
      break_mins: parseInt(breakMins, 10) || 0,
      late_grace_mins: parseInt(lateGraceMins, 10) || 0,
      allow_overtime: allowOvertime,
    });
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
        {initialData ? 'Save Changes' : 'Save Shift'}
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Shift Template" : "Add Shift Template"}
      subtitle={initialData ? "Modify working hours rules" : "Define standard workday durations and grace allowances"}
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Section: GENERAL DETAILS */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>General Details</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Shift Name *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. General Shift"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Shift Code *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. GS-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        {/* Section: WORK TIMINGS */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Work Timings</span>
        </div>

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

        {/* Section: DURATIONS & GRACE */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Break & Grace Rules</span>
        </div>

        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Break (Mins) *</label>
            <input
              type="number"
              className={styles.input}
              placeholder="e.g. 60"
              value={breakMins}
              onChange={(e) => setBreakMins(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Late Grace (Mins) *</label>
            <input
              type="number"
              className={styles.input}
              placeholder="e.g. 15"
              value={lateGraceMins}
              onChange={(e) => setLateGraceMins(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <input
            type="checkbox"
            id="allowOvertime"
            checked={allowOvertime}
            onChange={(e) => setAllowOvertime(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="allowOvertime" className={styles.label} style={{ margin: 0, cursor: 'pointer' }}>
            Allow Overtime Calculations
          </label>
        </div>

      </form>
    </SlideOverDrawer>
  );
}
