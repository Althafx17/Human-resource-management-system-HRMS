import React from 'react';
import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface ContractTabProps {
  employee: EmployeeData;
  isEditing?: boolean;
  editData?: EmployeeData | null;
  onChange?: (fields: Partial<EmployeeData>) => void;
}

export default function ContractTab({ employee, isEditing, editData, onChange }: ContractTabProps) {
  const data = isEditing && editData ? editData : employee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onChange) {
      onChange({ [e.target.name]: e.target.value });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> AGREEMENT DETAILS
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}>
          <label>CONTRACT TYPE</label>
          {isEditing ? (
            <input 
              type="text" 
              name="contractType" 
              value={data.contractType || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.contractType || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>START DATE</label>
          {isEditing ? (
            <input 
              type="date" 
              name="contractStart" 
              value={data.contractStart || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.contractStart || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>END DATE</label>
          {isEditing ? (
            <input 
              type="date" 
              name="contractEnd" 
              value={data.contractEnd || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.contractEnd || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>STATUS</label>
          {isEditing ? (
            <select 
              name="contractStatus" 
              value={data.contractStatus || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput}
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
            </select>
          ) : (
            <span>{data.contractStatus || '—'}</span>
          )}
        </div>
      </div>
      {data.contractFile && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eef2f6', paddingTop: '16px' }}>
          <div className={styles.sectionTitle}>
            <div className={styles.blueLine}></div> ATTACHMENT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0', marginTop: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a3646' }}>{data.contractFile}</span>
          </div>
        </div>
      )}
    </div>
  );
}