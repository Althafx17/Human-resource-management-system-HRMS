import React, { useRef } from 'react';
import styles from './AddEmployee.module.css';

interface Step1Props {
  data: {
    name: string;
    dob: string;
    phone: string;
    emergencyContactName: string;
    address: string;
    avatar?: File | string | null;
  };
  updateData: (fields: Partial<Step1Props['data']>) => void;
}

export default function Step1PersonalInfo({ data, updateData }: Step1Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ avatar: file });
    }
  };

  const avatarSrc = data.avatar instanceof File
    ? URL.createObjectURL(data.avatar)
    : (data.avatar || 'https://i.pravatar.cc/150?u=new');

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 1: Personal Info</h2>
      
      <div className={styles.avatarSection}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        <div className={styles.avatarCircle} onClick={handleUploadClick} title="Upload photo">
          <img src={avatarSrc} alt="Avatar Preview" className={styles.avatarImage} />
        </div>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Click circle to change profile photo</span>
      </div>

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
