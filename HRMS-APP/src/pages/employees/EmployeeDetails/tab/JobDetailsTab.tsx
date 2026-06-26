import React from 'react';
import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface JobDetailsTabProps {
  employee: EmployeeData;
  isEditing?: boolean;
  editData?: EmployeeData | null;
  onChange?: (fields: Partial<EmployeeData>) => void;
}

export default function JobDetailsTab({ employee, isEditing, editData, onChange }: JobDetailsTabProps) {
  const data = isEditing && editData ? editData : employee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onChange) {
      onChange({ [e.target.name]: e.target.value });
    }
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
            <input 
              type="text" 
              name="reportingManager" 
              value={data.reportingManager || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.reportingManager || '—'}</span>
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