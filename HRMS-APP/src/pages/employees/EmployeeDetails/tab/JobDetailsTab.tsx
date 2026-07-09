import React from 'react';
import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface JobDetailsTabProps {
  employee: EmployeeData;
  isEditing?: boolean;
  editData?: EmployeeData | null;
  onChange?: (fields: Partial<EmployeeData>) => void;
  managers?: { id: string; name: string }[];
}

export default function JobDetailsTab({ employee, isEditing, editData, onChange, managers }: JobDetailsTabProps) {
  const data = isEditing && editData ? editData : employee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onChange) {
      onChange({ [e.target.name]: e.target.value });
    }
  };

  // Convert legacy names or match select values
  const getSelectValue = () => {
    const val = data.reportingManager;
    if (!val) return '';
    if (!isNaN(Number(val)) && String(val).trim() !== '') return String(val);
    
    const found = (managers || []).find(m => m.name.toLowerCase() === val.toLowerCase());
    return found ? found.id : '';
  };

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> CURRENT POSITION
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}>
          <label>DEPARTMENT</label>
          {isEditing ? (
            <select 
              name="department" 
              value={data.department || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput}
            >
              <option value="1">IT</option>
              <option value="2">HR</option>
              <option value="3">Finance</option>
              <option value="4">Sales</option>
            </select>
          ) : (
            <span>{data.department || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>REPORTING MANAGER</label>
          {isEditing ? (
            <select 
              name="reportingManager" 
              value={getSelectValue()} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            >
              <option value="">No Manager</option>
              {(managers || []).map((mgr) => (
                <option key={mgr.id} value={mgr.id}>
                  {mgr.name}
                </option>
              ))}
            </select>
          ) : (
            <span>
              {(() => {
                const mgrVal = data.reportingManager || '';
                if (!mgrVal || mgrVal === 'No Manager') return '—';
                const found = (managers || []).find(m => String(m.id) === String(mgrVal) || m.name.toLowerCase() === String(mgrVal).toLowerCase());
                return found ? found.name : mgrVal;
              })()}
            </span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>WORK LOCATION</label>
          {isEditing ? (
            <input 
              type="text" 
              name="workLocation" 
              value={data.workLocation || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.workLocation || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>SHIFT</label>
          {isEditing ? (
            <input 
              type="text" 
              name="shift" 
              value={data.shift || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.shift || '—'}</span>
          )}
        </div>
      </div>
    </div>
  );
}