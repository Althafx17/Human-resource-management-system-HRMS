import React from 'react';
import styles from './AddEmployee.module.css';

interface Step2Props {
  data: {
    department: string;
    designation: string;
    reportingManager: string;
    joiningDate: string;
    employmentType: string;
  };
  updateData: (fields: Partial<Step2Props['data']>) => void;
}

export default function Step2JobDetails({ data, updateData }: Step2Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 2: Job Details</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={data.department || ''}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="" disabled>Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Finance">Finance</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="designation">Designation</label>
          <select
            id="designation"
            name="designation"
            value={data.designation || ''}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="" disabled>Select Designation</option>
            <option value="Sr. Back End Developer">Sr. Back End Developer</option>
            <option value="Sr. UI UX Designer">Sr. UI UX Designer</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="reportingManager">Reporting Manager</label>
          <input
            id="reportingManager"
            type="text"
            name="reportingManager"
            value={data.reportingManager || ''}
            onChange={handleChange}
            placeholder="Sarah Connor"
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="joiningDate">Joining Date</label>
          <input
            id="joiningDate"
            type="date"
            name="joiningDate"
            value={data.joiningDate || ''}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="employmentType">Employment Type</label>
          <select
            id="employmentType"
            name="employmentType"
            value={data.employmentType || ''}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="" disabled>Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>
    </div>
  );
}
