import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../data';

interface PayrollTabProps {
  employee: EmployeeData;
}

export default function PayrollTab({ employee }: PayrollTabProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> SALARY & BANKING
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}><label>BASIC SALARY</label><span>{employee.basicSalary || '—'}</span></div>
        <div className={styles.infoGroup}><label>PAYMENT FREQUENCY</label><span>{employee.paymentFrequency || '—'}</span></div>
        <div className={styles.infoGroup}><label>BANK NAME</label><span>{employee.bankName || '—'}</span></div>
        <div className={styles.infoGroup}><label>ACCOUNT NUMBER</label><span>{employee.accountNumber || '—'}</span></div>
      </div>
    </div>
  );
}