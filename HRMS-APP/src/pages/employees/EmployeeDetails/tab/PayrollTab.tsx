import React from 'react';
import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface PayrollTabProps {
  employee: EmployeeData;
  isEditing?: boolean;
  editData?: EmployeeData | null;
  onChange?: (fields: Partial<EmployeeData>) => void;
}

export default function PayrollTab({ employee, isEditing, editData, onChange }: PayrollTabProps) {
  const data = isEditing && editData ? editData : employee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ [e.target.name]: e.target.value });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> SALARY & BANKING
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}>
          <label>BASIC SALARY</label>
          {isEditing ? (
            <input 
              type="text" 
              name="basicSalary" 
              value={data.basicSalary || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.basicSalary || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>PAYMENT FREQUENCY</label>
          {isEditing ? (
            <input 
              type="text" 
              name="paymentFrequency" 
              value={data.paymentFrequency || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.paymentFrequency || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>BANK NAME</label>
          {isEditing ? (
            <input 
              type="text" 
              name="bankName" 
              value={data.bankName || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.bankName || '—'}</span>
          )}
        </div>
        <div className={styles.infoGroup}>
          <label>ACCOUNT NUMBER</label>
          {isEditing ? (
            <input 
              type="text" 
              name="accountNumber" 
              value={data.accountNumber || ''} 
              onChange={handleInputChange} 
              className={styles.inlineInput} 
            />
          ) : (
            <span>{data.accountNumber || '—'}</span>
          )}
        </div>
      </div>
    </div>
  );
}