import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import styles from './AddEmployee.module.css';

interface Step3Props {
  data: {
    contractType: string;
    contractStatus: string;
    contractStart: string;
    contractEnd: string;
    contractFile: string; // filename
  };
  updateData: (fields: Partial<Step3Props['data']>) => void;
}

export default function Step3Contract({ data, updateData }: Step3Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateData({ contractFile: e.target.files[0].name });
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 3: Contract</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="contractType">Contract Type</label>
          <input
            id="contractType"
            type="text"
            name="contractType"
            value={data.contractType || ''}
            onChange={handleChange}
            placeholder="Full-Time Permanent"
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="contractStatus">Contract Status</label>
          <select
            id="contractStatus"
            name="contractStatus"
            value={data.contractStatus || ''}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="" disabled>Select Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Expired">Expired</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="contractStart">Contract Start Date</label>
          <input
            id="contractStart"
            type="date"
            name="contractStart"
            value={data.contractStart || ''}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="contractEnd">Contract End Date</label>
          <input
            id="contractEnd"
            type="date"
            name="contractEnd"
            value={data.contractEnd || ''}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        {/* Upload Dropzone */}
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label>Upload Contract Document</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg"
            style={{ display: 'none' }}
          />
          <div className={styles.dropzone} onClick={triggerFileSelect}>
            <div className={styles.dropzoneIcon}>
              <Upload size={24} />
            </div>
            <div className={styles.dropzoneText}>
              <span>
                {data.contractFile ? (
                  <span style={{ color: '#10b981' }}>Selected: {data.contractFile}</span>
                ) : (
                  "Click to upload or drag & drop"
                )}
              </span>
              <p>PDF or JPG up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
