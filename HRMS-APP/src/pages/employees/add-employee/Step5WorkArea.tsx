import React from 'react';
import styles from './AddEmployee.module.css';

interface Step5Props {
  data: {
    workArea: string;
    geoFence: string;
    shift: string;
    attendanceRequired: boolean;
  };
  updateData: (fields: Partial<Step5Props['data']>) => void;
}

export default function Step5WorkArea({ data, updateData }: Step5Props) {
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
      <h2 className={styles.stepTitle}>Step 5: Work Area</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="workArea">Assign Work Area</label>
          <select
            id="workArea"
            name="workArea"
            value={data.workArea || ''}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="" disabled>Select Work Area</option>
            <option value="Headquarters">Headquarters</option>
            <option value="Branch A">Branch A</option>
            <option value="Branch B">Branch B</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="geoFence">Geo-Fence Location</label>
          <input
            id="geoFence"
            type="text"
            name="geoFence"
            value={data.geoFence || ''}
            onChange={handleChange}
            placeholder="e.g. 37.7749° N, 122.4194° W"
            className={styles.inputField}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="shift">Shift Assignment</label>
          <select
            id="shift"
            name="shift"
            value={data.shift || ''}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="" disabled>Select Shift</option>
            <option value="Standard (9:00 AM - 5:00 PM)">Standard (9:00 AM - 5:00 PM)</option>
            <option value="Morning Shift (6:00 AM - 2:00 PM)">Morning Shift (6:00 AM - 2:00 PM)</option>
            <option value="Evening Shift (2:00 PM - 10:00 PM)">Evening Shift (2:00 PM - 10:00 PM)</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="attendanceRequired"
              checked={data.attendanceRequired || false}
              onChange={handleCheckboxChange}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxLabel}>Attendance Required</span>
          </label>
        </div>
      </div>
    </div>
  );
}
