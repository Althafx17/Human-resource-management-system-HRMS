import { FileText, Download } from 'lucide-react';
import styles from '../EmployeeDetails.module.css';
import type { EmployeeData } from '../../types';

interface DocumentsTabProps {
  employee: EmployeeData;
  isEditing?: boolean;
  editData?: EmployeeData | null;
  onChange?: (fields: Partial<EmployeeData>) => void;
}

export default function DocumentsTab({ employee }: DocumentsTabProps) {
  // Extract files from employee data
  const docs = [
    { name: 'Resume', fileName: employee.resumeFile },
    { name: 'Certificates', fileName: employee.certificatesFile },
    { name: 'Contract File', fileName: employee.contractFile }
  ].filter(doc => doc.fileName); // Only show if they exist

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <div className={styles.blueLine}></div> UPLOADED FILES
      </div>
      <div className={styles.documentList}>
        {docs.length > 0 ? (
          docs.map(doc => (
            <div key={doc.name} className={styles.documentRow}>
              <div className={styles.documentMeta}>
                <FileText size={20} color="#64748b" />
                <div>
                  <span className={styles.documentName} style={{ display: 'block', fontWeight: '600' }}>{doc.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{doc.fileName}</span>
                </div>
              </div>
              <button 
                type="button" 
                className={`${styles.btnOutline} ${styles.documentDownloadBtn}`} 
                title={`Download ${doc.name}`} 
                aria-label={`Download ${doc.name}`}
                onClick={() => alert(`Downloading: ${doc.fileName}`)}
              >
                <Download size={14} /> Download
              </button>
            </div>
          ))
        ) : (
          <span style={{ fontSize: '14px', color: '#64748b' }}>No documents uploaded yet.</span>
        )}
      </div>
    </div>
  );
}