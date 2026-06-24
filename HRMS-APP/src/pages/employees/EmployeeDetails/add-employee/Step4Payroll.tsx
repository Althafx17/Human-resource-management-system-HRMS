import React from 'react';
import styles from './AddEmployee.module.css';

interface Step4Props {
  data: {
    wageType: string;
    basicSalary: string;
    allowances: string;
    deductions: string;
    payrollRules: string;
    overtimeEligible: boolean;
  };
  updateData: (fields: Partial<Step4Props['data']>) => void;
}

export default function Step4Payroll({ data, updateData }: Step4Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateData({ [name]: checked });
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 4: Payroll</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="wageType">Wage Type</label>
          <select
            id="wageType"
            name="wageType"
            value={data.wageType || ''}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="" disabled>Select Wage Type</option>
            <option value="Monthly Salary">Monthly Salary</option>
            <option value="Hourly Rate">Hourly Rate</option>
            <option value="Weekly Wages">Weekly Wages</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="basicSalary">Basic Salary / Rate</label>
          <div className={styles.inputWithPrefix}>
            <span className={styles.prefix}>$</span>
            <input
              id="basicSalary"
              type="text"
              name="basicSalary"
              value={data.basicSalary || ''}
              onChange={handleChange}
              placeholder="95,000"
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="allowances">Allowances</label>
          <input
            id="allowances"
            type="text"
            name="allowances"
            value={data.allowances || ''}
            onChange={handleChange}
            placeholder="e.g. Travel: $200"
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="deductions">Deductions</label>
          <input
            id="deductions"
            type="text"
            name="deductions"
            value={data.deductions || ''}
            onChange={handleChange}
            placeholder="e.g. Tax, Insurance"
            className={styles.inputField}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="payrollRules">Payroll Calculation Rules</label>
          <input
            id="payrollRules"
            type="text"
            name="payrollRules"
            value={data.payrollRules || ''}
            onChange={handleChange}
            placeholder="Standard tax bracket calculation"
            className={styles.inputField}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="overtimeEligible"
              checked={data.overtimeEligible || false}
              onChange={handleCheckboxChange}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxLabel}>Eligible for Overtime</span>
          </label>
        </div>
      </div>
    </div>
  );
}
