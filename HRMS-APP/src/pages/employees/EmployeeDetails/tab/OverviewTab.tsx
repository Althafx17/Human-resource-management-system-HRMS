import { Calendar, Clock } from 'lucide-react';
import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface OverviewTabProps {
  employee: EmployeeData;
}

export default function OverviewTab({ employee }: OverviewTabProps) {
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
            <div className={styles.infoGroup}><label>DATE OF BIRTH</label><span>{employee.dob || '—'}</span></div>
            <div className={styles.infoGroup}><label>PHONE</label><span>{employee.phone || '—'}</span></div>
            <div className={styles.infoGroup}><label>ADDRESS</label><span>{employee.address || '—'}</span></div>
            <div className={styles.infoGroup}><label>JOINING DATE</label><span>{employee.joiningDate || '—'}</span></div>
          </div>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.redLine}></div> EMERGENCY
          </div>
          <div className={styles.emergencyBox}>
            <h4>{employee.emergencyContactName || '—'}</h4>
            <p>{employee.emergencyContactPhone || '—'}</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.blueLine}></div> SKILLS
          </div>
          <div className={styles.skillsContainer}>
            {employee.skills && employee.skills.length > 0 ? (
              employee.skills.map((skill, index) => (
                <span key={index} className={styles.skillBadge}>{skill.toUpperCase()}</span>
              ))
            ) : (
              <span className={styles.mutedText} style={{ fontSize: '14px' }}>No skills added yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}