import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface OverviewTabProps {
  employee: EmployeeData;
  isEditing?: boolean;
  editData?: EmployeeData | null;
  onChange?: (fields: Partial<EmployeeData>) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function OverviewTab({ employee, isEditing, editData, onChange, onSave, onCancel }: OverviewTabProps) {
  const data = isEditing && editData ? editData : employee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ [e.target.name]: e.target.value });
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
      onChange({ skills: skillsArray });
    }
  };

  return (
    <div className={styles.contentGrid}>
      <div className={styles.leftColumn}>
        <div className={styles.topRowStats}>
          <div className={`${styles.card} ${styles.flexCard}`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBox} ${styles.blueBox}`}><Calendar size={20}/></div>
              <span className={styles.cardTitle}>ATTENDANCE & LEAVE</span>
            </div>
            <div className={styles.statSplit}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>RATE</span>
                <span className={styles.statValue}>96%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>BALANCE</span>
                <span className={styles.statValue}>14d</span>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.flexCard}`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBox} ${styles.yellowBox}`}><Clock size={20}/></div>
              <span className={styles.cardTitle}>OT SUMMARY</span>
            </div>
            <div className={styles.statSplit}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>HOURS</span>
                <span className={styles.statValue}>12.5h</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>STATUS</span>
                <span className={styles.statTextGreen}>PAID</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.blueLine}></div> PRIMARY INFO
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoGroup}>
              <label>DATE OF BIRTH</label>
              {isEditing ? (
                <input 
                  type="date" 
                  name="dob" 
                  value={data.dob || ''} 
                  onChange={handleInputChange} 
                  className={styles.inlineInput} 
                />
              ) : (
                <span>{data.dob || '—'}</span>
              )}
            </div>
            <div className={styles.infoGroup}>
              <label>PHONE</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="phone" 
                  value={data.phone || ''} 
                  onChange={handleInputChange} 
                  className={styles.inlineInput} 
                />
              ) : (
                <span>{data.phone || '—'}</span>
              )}
            </div>
            <div className={styles.infoGroup}>
              <label>ADDRESS</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="address" 
                  value={data.address || ''} 
                  onChange={handleInputChange} 
                  className={styles.inlineInput} 
                />
              ) : (
                <span>{data.address || '—'}</span>
              )}
            </div>
            <div className={styles.infoGroup}>
              <label>JOINING DATE</label>
              {isEditing ? (
                <input 
                  type="date" 
                  name="joiningDate" 
                  value={data.joiningDate || ''} 
                  onChange={handleInputChange} 
                  className={styles.inlineInput} 
                />
              ) : (
                <span>{data.joiningDate || '—'}</span>
              )}
            </div>
          </div>
          {isEditing && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid #eef2f6', paddingTop: '16px' }}>
              <button 
                type="button" 
                className={styles.btnOutline} 
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary} 
                onClick={onSave}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.redLine}></div> EMERGENCY
          </div>
          <div className={styles.emergencyBox}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="text" 
                  name="emergencyContactName" 
                  placeholder="Contact Name"
                  value={data.emergencyContactName || ''} 
                  onChange={handleInputChange} 
                  className={styles.inlineInput} 
                />
                <input 
                  type="text" 
                  name="emergencyContactPhone" 
                  placeholder="Contact Phone"
                  value={data.emergencyContactPhone || ''} 
                  onChange={handleInputChange} 
                  className={styles.inlineInput} 
                />
              </div>
            ) : (
              <>
                <h4>{data.emergencyContactName || '—'}</h4>
                <p>{data.emergencyContactPhone || '—'}</p>
              </>
            )}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.blueLine}></div> SKILLS
          </div>
          <div className={styles.skillsContainer}>
            {isEditing ? (
              <input 
                type="text" 
                name="skills" 
                placeholder="Comma separated: React, Node, etc."
                value={Array.isArray(data.skills) ? data.skills.join(', ') : ''} 
                onChange={handleSkillsChange} 
                className={styles.inlineInput} 
              />
            ) : (
              data.skills && data.skills.length > 0 ? (
                data.skills.map((skill, index) => (
                  <span key={index} className={styles.skillBadge}>{skill.toUpperCase()}</span>
                ))
              ) : (
                <span className={styles.mutedText} style={{ fontSize: '14px' }}>No skills added yet</span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}