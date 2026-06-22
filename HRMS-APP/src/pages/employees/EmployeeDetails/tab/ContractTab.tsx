import styles from '../EmployeeDetails.module.css';

export default function ContractTab() {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> AGREEMENT DETAILS
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}><label>CONTRACT TYPE</label><span>Full-Time Permanent</span></div>
        <div className={styles.infoGroup}><label>START DATE</label><span>2022-01-10</span></div>
        <div className={styles.infoGroup}><label>PROBATION PERIOD</label><span>Completed (3 Months)</span></div>
        <div className={styles.infoGroup}><label>NOTICE PERIOD</label><span>30 Days</span></div>
      </div>
    </div>
  );
}