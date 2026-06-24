import React from 'react';
import styles from './AddEmployee.module.css';

interface Step1Props {
  data: {
    name: string;
    dob: string;
    phone: string;
    emergencyContactName: string;
    address: string;
  };
  updateData: (fields: Partial<Step1Props['data']>) => void;
}

export default function Step1PersonalInfo({ data, updateData }: Step1Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 1: Personal Info</h2>
      <div className={styles.formGrid}>
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={data.name || ''}
            onChange={handleChange}
            placeholder="John Doe"
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            type="date"
            name="dob"
            value={data.dob || ''}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">Contact Details / Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={data.phone || ''}
            onChange={handleChange}
            placeholder="+1 (234) 567-8900"
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="emergencyContactName">Emergency Contact</label>
          <input
            id="emergencyContactName"
            type="text"
            name="emergencyContactName"
            value={data.emergencyContactName || ''}
            onChange={handleChange}
            placeholder="Jane Doe (+1 234 567 891)"
            className={styles.inputField}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="address">Home Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={data.address || ''}
            onChange={handleChange}
            placeholder="123 Tech Street, San Francisco, CA"
            className={styles.inputField}
          />
        </div>
      </div>
    </div>
  );
}
