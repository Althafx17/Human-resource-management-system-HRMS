import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface JobDetailsTabProps {
  employee: EmployeeData;
}

export default function JobDetailsTab({ employee }: JobDetailsTabProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> CURRENT POSITION
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}><label>DEPARTMENT</label><span>{employee.department || '—'}</span></div>
        <div className={styles.infoGroup}><label>REPORTING MANAGER</label><span>{employee.reportingManager || '—'}</span></div>
        <div className={styles.infoGroup}><label>WORK LOCATION</label><span>{employee.workLocation || '—'}</span></div>
        <div className={styles.infoGroup}><label>SHIFT</label><span>{employee.shift || '—'}</span></div>
      </div>
    </div>
  );
}