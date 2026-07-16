import { Clock, User } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import styles from './ReviewStyles.module.css';

interface LeaveRequestData {
  id: string;
  employeeName: string;
  avatar?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  reason?: string;
}

interface ReviewLeaveRequestProps {
  isOpen: boolean;
  onClose: () => void;
  request?: LeaveRequestData;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const DEFAULT_REQUEST: LeaveRequestData = {
  id: 'LR002',
  employeeName: 'John Smith',
  avatar: 'https://i.pravatar.cc/150?u=1',
  type: 'Sick Leave',
  startDate: '2026-06-20',
  endDate: '2026-06-21',
  days: 2,
  status: 'Pending',
  reason: 'Medical rest advised by physician.',
};

export default function ReviewLeaveRequest({
  isOpen,
  onClose,
  request = DEFAULT_REQUEST,
  onApprove,
  onReject,
}: ReviewLeaveRequestProps) {
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
          Approve Leave
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
      title="Review Leave Request"
      subtitle={`Request ID: ${request.id}`}
      footerActions={footerActions}
    >
      {/* 1. Status Banner */}
      <div className={`${styles.banner} ${styles.pendingBanner}`}>
        <Clock size={16} />
        <span>Pending Approval (Awaiting decision)</span>
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
          <span className={styles.gridLabel}>Leave Type</span>
          <span className={styles.gridValue}>
            <span className={styles.blueDot}></span>
            {request.type}
          </span>
        </div>

        <div className={styles.gridItem}>
          <span className={styles.gridLabel}>Total Days</span>
          <span className={styles.gridValue}>
            <span className={styles.purplePill}>
              {request.days} {request.days === 1 ? 'Day' : 'Days'}
            </span>
          </span>
        </div>

        <div className={styles.gridItem}>
          <span className={styles.gridLabel}>Start Date</span>
          <span className={styles.gridValue}>{request.startDate}</span>
        </div>

        <div className={styles.gridItem}>
          <span className={styles.gridLabel}>End Date</span>
          <span className={styles.gridValue}>{request.endDate}</span>
        </div>

        {request.reason && (
          <div className={`${styles.gridItem} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
            <span className={styles.gridLabel}>Reason</span>
            <span className={styles.gridValue} style={{ fontWeight: 'normal', color: '#475569' }}>
              {request.reason}
            </span>
          </div>
        )}
      </div>
    </SlideOverDrawer>
  );
}
