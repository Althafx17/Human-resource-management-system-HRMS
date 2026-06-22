import styles from '../EmployeeDetails.module.css';

export default function JobDetailsTab() {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> CURRENT POSITION
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}><label>DEPARTMENT</label><span>Engineering</span></div>
        <div className={styles.infoGroup}><label>REPORTING MANAGER</label><span>Sarah Connor</span></div>
        <div className={styles.infoGroup}><label>WORK LOCATION</label><span>San Francisco (Hybrid)</span></div>
        <div className={styles.infoGroup}><label>SHIFT</label><span>Standard (9:00 AM - 5:00 PM)</span></div>
      </div>
    </div>
  );
}