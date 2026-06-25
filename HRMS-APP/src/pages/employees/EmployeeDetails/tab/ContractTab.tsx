import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface ContractTabProps {
  employee: EmployeeData;
}

export default function ContractTab({ employee }: ContractTabProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> AGREEMENT DETAILS
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}><label>CONTRACT TYPE</label><span>{employee.contractType || '—'}</span></div>
        <div className={styles.infoGroup}><label>START DATE</label><span>{employee.contractStart || '—'}</span></div>
        <div className={styles.infoGroup}><label>END DATE</label><span>{employee.contractEnd || '—'}</span></div>
        <div className={styles.infoGroup}><label>STATUS</label><span>{employee.contractStatus || '—'}</span></div>
      </div>
      {employee.contractFile && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eef2f6', paddingTop: '16px' }}>
          <div className={styles.sectionTitle}>
            <div className={styles.blueLine}></div> ATTACHMENT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0', marginTop: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a3646' }}>{employee.contractFile}</span>
          </div>
        </div>
      )}
    </div>
  );
}