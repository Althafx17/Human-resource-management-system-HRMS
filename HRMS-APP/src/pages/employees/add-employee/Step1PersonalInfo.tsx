import React, { useRef } from 'react';
import { User } from 'lucide-react';
import styles from './AddEmployee.module.css';

interface Step1Props {
  data: {
    name: string;
    dob: string;
    phone: string;
    email: string;
    password?: string; // ---> NEW: Optional password field
    emergencyContactName: string;
    address: string;
    avatar?: File | string | null;
  };
  updateData: (fields: Partial<Step1Props['data']>) => void;
  isEditMode?: boolean; // ---> NEW: Optional edit mode flag
}

export default function Step1PersonalInfo({ data, updateData, isEditMode = false }: Step1Props) {
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
    : (data.avatar || '');

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 1: Personal Info</h2>
      
      <div className={styles.avatarSection}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className={styles.hiddenFileInput}
          title="Upload employee profile image"
          aria-label="Upload employee profile image"
        />
        <div className={styles.avatarCircle} onClick={handleUploadClick} title="Upload photo">
          {avatarSrc ? (
            <img src={avatarSrc} alt="Avatar Preview" className={styles.avatarImage} />
          ) : (
            <User size={40} color="#94a3b8" />
          )}
        </div>
        <span className={styles.avatarHint}>Click circle to change profile photo</span>
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
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email || ''}
            onChange={handleChange}
            placeholder="john.doe@company.com"
            className={styles.inputField}
            required
          />
        </div>

        {/* ---> NEW: Login password for employee's CustomUser account (creation mode only) */}
        {!isEditMode && (
          <div className={styles.inputGroup}>
            <label htmlFor="password">Login Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={data.password || ''}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className={styles.inputField}
              required
            />
          </div>
        )}

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
