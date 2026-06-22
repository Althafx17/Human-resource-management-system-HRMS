import styles from '../EmployeeDetails.module.css';

export default function PayrollTab() {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> SALARY & BANKING
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}><label>BASIC SALARY</label><span>$95,000 / Year</span></div>
        <div className={styles.infoGroup}><label>PAYMENT FREQUENCY</label><span>Bi-Weekly</span></div>
        <div className={styles.infoGroup}><label>BANK NAME</label><span>Chase Bank</span></div>
        <div className={styles.infoGroup}><label>ACCOUNT NUMBER</label><span>**** **** 4321</span></div>
      </div>
    </div>
  );
}