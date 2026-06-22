import { FileText, Download } from 'lucide-react';
import styles from '../EmployeeDetails.module.css';

export default function DocumentsTab() {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> UPLOADED FILES
      </div>
      <div className={styles.documentList}>
        
        {/* Reusable Document Row Item */}
        {[ 'Signed_Contract.pdf', 'ID_Verification.pdf', 'Resume_2022.pdf' ].map(doc => (
          <div key={doc} className={styles.documentRow}>
            <div className={styles.documentMeta}>
              <FileText size={20} color="#64748b" />
              <span className={styles.documentName}>{doc}</span>
            </div>
            <button type="button" className={`${styles.btnOutline} ${styles.documentDownloadBtn}`} title={`Download ${doc}`} aria-label={`Download ${doc}`}>
              <Download size={14} /> Download
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}