// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import React, { useState, useEffect } from 'react';
import SlideOverDrawer from '../../../components/common/SlideOverDrawer';
import styles from '../../../components/forms/FormStyles.module.css';
import tabStyles from '../tabs/Tabs.module.css';
import { employeeApi } from '../../../services/employeeApi';
import { shiftAdminApi } from '../../../services/shiftAdminApi';
import type { EmployeeData } from '../../employees/types';
import type { ShiftTemplate, ShiftAssignment } from '../types';

// ==========================================
// 2. TYPES & PROPS
// ==========================================
interface AssignShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ShiftAssignment, 'id'>) => void;
}

// ==========================================
// 3. MAIN ASSIGNMENT MODAL COMPONENT
// ==========================================
export default function AssignShiftModal({ isOpen, onClose, onSave }: AssignShiftModalProps) {
  // Query state holders
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [shifts, setShifts] = useState<ShiftTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form parameters
  const [employeeId, setEmployeeId] = useState('');
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [assignmentType, setAssignmentType] = useState('Regular');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);

  // Load dependency lookup lists when opening drawer
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Query first 10 pages of employees to compile a seed lookup dropdown
      const employeeRequests = Array.from({ length: 10 }, (_, i) => employeeApi.getAll(i + 1).catch(() => null));
      
      Promise.all([
        Promise.all(employeeRequests),
        shiftAdminApi.shifts.getAll()
      ]).then(([employeeResults, shiftResults]) => {
        // Flatten non-null results list
        const flattenedEmps: EmployeeData[] = [];
        employeeResults.forEach(res => {
          if (res && res.results) {
            flattenedEmps.push(...res.results);
          }
        });
        
        setEmployees(flattenedEmps);
        setShifts(shiftResults);
        
        // Default initial form values
        if (flattenedEmps.length > 0) setEmployeeId(String(flattenedEmps[0].id));
        if (shiftResults.length > 0) setShiftId(shiftResults[0].id);
        
        setIsLoading(false);
      }).catch(err => {
        console.error('Failed to load assignment dependencies:', err);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !shiftId || !assignmentType || !effectiveFrom) {
      alert('Please complete all form selections.');
      return;
    }
    onSave({
      employee_id: parseInt(employeeId, 10),
      shift_id: shiftId,
      assignment_type: assignmentType,
      effective_from: effectiveFrom,
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
        disabled={isLoading}
      >
        Assign Shift
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Shift Pattern"
      subtitle="Schedule dated shift assignments for staff members"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Section: CHOOSE EMPLOYEE */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Employee Selection</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Select Employee *</label>
          <select
            className={styles.select}
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="">Choose an employee...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employeeCode || `#${emp.id}`})
              </option>
            ))}
          </select>
        </div>

        {/* Section: CHOOSE SHIFT SCHEDULE */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Shift Schedule *</span>
        </div>

        <div className={tabStyles.radioList}>
          {isLoading ? (
            <div style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>Loading templates...</div>
          ) : shifts.length === 0 ? (
            <div style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>No shift templates created yet. Please add templates in Shift Master first.</div>
          ) : (
            shifts.map(shift => (
              <div
                key={shift.id}
                className={`${tabStyles.radioCard} ${shiftId === shift.id ? tabStyles.radioSelected : ''}`}
                onClick={() => setShiftId(shift.id)}
              >
                <input
                  type="radio"
                  name="shiftSelection"
                  checked={shiftId === shift.id}
                  onChange={() => setShiftId(shift.id)}
                  style={{ cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{shift.name} ({shift.code})</span>
                  <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Timing: {shift.start_time} - {shift.end_time}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section: ASSIGNMENT RULES */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Rules & Activation</span>
        </div>

        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Assignment Type *</label>
            <select
              className={styles.select}
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
              required
            >
              <option value="Regular">Regular</option>
              <option value="Temporary">Temporary</option>
              <option value="Overtime Only">Overtime Only</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Effective From *</label>
            <input
              type="date"
              className={styles.input}
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              required
            />
          </div>
        </div>

      </form>
    </SlideOverDrawer>
  );
}
