import { CheckCircle, Clock, User } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import styles from './ReviewStyles.module.css';

interface OvertimeRequestData {
  id: string;
  employeeName: string;
  avatar?: string;
  date: string;
  hoursLogged: number;
  multiplier: number;
  estPayout: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes?: string;
}

interface ReviewOvertimeProps {
  isOpen: boolean;
  onClose: () => void;
  request?: OvertimeRequestData;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const DEFAULT_REQUEST: OvertimeRequestData = {
  id: 'OT001',
  employeeName: 'John Smith',
  avatar: 'https://i.pravatar.cc/150?u=1',
  date: '2026-06-18',
  hoursLogged: 3.5,
  multiplier: 1.5,
  estPayout: 105.00,
  status: 'Approved',
  notes: 'Completed backend database migrations and cleanup.',
};

export default function ReviewOvertime({
  isOpen,
  onClose,
  request = DEFAULT_REQUEST,
  onApprove,
  onReject,
}: ReviewOvertimeProps) {
  const handleApprove = () => {
    if (onApprove) onApprove(request.id);
    onClose();
  };

  const handleReject = () => {
    if (onReject) onReject(request.id);
    onClose();
  };

  const footerActions = (
    <div className={styles.footerContainer}>
      <div className={styles.topActions}>
        <button 
          type="button" 
          className={styles.rejectBtn}
          onClick={handleReject}
        >
          Reject
        </button>
        <button 
          type="button" 
          className={styles.approveBtn}
          onClick={handleApprove}
        >
          Approve Overtime
        </button>
      </div>
      <button 
        type="button" 
        className={styles.discardFullBtn}
        onClick={onClose}
      >
        Discard
      </button>
    </div>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Review Overtime Request"
      subtitle={`Request ID: ${request.id}`}
      footerActions={footerActions}
    >
      {/* 1. Status Banner */}
      <div className={`${styles.banner} ${styles.approvedBanner}`}>
        <CheckCircle size={16} />
        <span>Approved & Verified (Awaiting payout processing)</span>
      </div>

      {/* 2. Employee Card */}
      <div className={styles.employeeCard}>
        {request.avatar ? (
          <img src={request.avatar} alt={request.employeeName} className={styles.avatar} />
        ) : (
          <div className={styles.avatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0' }}>
            <User size={20} color="#64748b" />
          </div>
        )}
        <div>
          <div className={styles.employeeName}>{request.employeeName}</div>
          <div className={styles.employeeSubtitle}>Full-Time Employee</div>
        </div>
      </div>

      {/* 3. Data Grid */}
      <div className={styles.dataGrid}>
        <div className={styles.gridItem}>
          <span className={styles.gridLabel}>Request Date</span>
          <span className={styles.gridValue}>{request.date}</span>
        </div>

        <div className={styles.gridItem}>
          <span className={styles.gridLabel}>OT Duration</span>
          <span className={styles.gridValue}>
            <span className={styles.purplePill}>
              <Clock size={12} style={{ marginRight: '2px' }} />
              {request.hoursLogged} Hours
            </span>
          </span>
        </div>

        <div className={styles.gridItem}>
          <span className={styles.gridLabel}>Rate Multiplier</span>
          <span className={styles.gridValue}>{request.multiplier}x Rate</span>
        </div>

        <div className={styles.gridItem}>
          <span className={styles.gridLabel}>Est. Payout</span>
          <span className={styles.gridValue} style={{ color: '#16a34a' }}>
            ${request.estPayout.toFixed(2)}
          </span>
        </div>

        {request.notes && (
          <div className={`${styles.gridItem} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
            <span className={styles.gridLabel}>Notes / Tasks Completed</span>
            <span className={styles.gridValue} style={{ fontWeight: 'normal', color: '#475569' }}>
              {request.notes}
            </span>
          </div>
        )}
      </div>
    </SlideOverDrawer>
  );
}
