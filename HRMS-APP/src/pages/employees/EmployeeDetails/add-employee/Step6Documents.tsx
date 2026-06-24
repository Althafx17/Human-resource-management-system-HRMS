import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import styles from './AddEmployee.module.css';

interface Step6Props {
  data: {
    resumeFile: string;
    certificatesFile: string;
    skills: string;
  };
  updateData: (fields: Partial<Step6Props['data']>) => void;
}

export default function Step6Documents({ data, updateData }: Step6Props) {
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateData({ resumeFile: e.target.files[0].name });
    }
  };

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateData({ certificatesFile: e.target.files[0].name });
    }
  };

  const triggerResumeSelect = () => {
    if (resumeInputRef.current) resumeInputRef.current.click();
  };

  const triggerCertSelect = () => {
    if (certInputRef.current) certInputRef.current.click();
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 6: Documents & Skills</h2>

      {/* Side by side dashed dropzones */}
      <div className={styles.dropzoneContainer}>
        <div className={styles.inputGroup}>
          <label>Resume / CV</label>
          <input
            type="file"
            ref={resumeInputRef}
            onChange={handleResumeChange}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
          />
          <div className={styles.dropzone} onClick={triggerResumeSelect} style={{ minHeight: '160px' }}>
            <div className={styles.dropzoneIcon}>
              <Upload size={20} />
            </div>
            <div className={styles.dropzoneText}>
              <span>
                {data.resumeFile ? (
                  <span style={{ color: '#10b981' }}>Selected: {data.resumeFile}</span>
                ) : (
                  "Upload Resume / CV"
                )}
              </span>
              <p>PDF, DOC, DOCX up to 10MB</p>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Certificates</label>
          <input
            type="file"
            ref={certInputRef}
            onChange={handleCertChange}
            accept=".pdf,.jpg,.zip"
            style={{ display: 'none' }}
          />
          <div className={styles.dropzone} onClick={triggerCertSelect} style={{ minHeight: '160px' }}>
            <div className={styles.dropzoneIcon}>
              <Upload size={20} />
            </div>
            <div className={styles.dropzoneText}>
              <span>
                {data.certificatesFile ? (
                  <span style={{ color: '#10b981' }}>Selected: {data.certificatesFile}</span>
                ) : (
                  "Upload Certificates"
                )}
              </span>
              <p>PDF, JPG, ZIP up to 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="skills">Skills List (Optional)</label>
          <textarea
            id="skills"
            name="skills"
            value={data.skills || ''}
            onChange={handleTextareaChange}
            placeholder="e.g. React, TypeScript, Figma, project management (comma-separated)"
            className={styles.inputField}
            style={{ minHeight: '120px', resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  );
}
