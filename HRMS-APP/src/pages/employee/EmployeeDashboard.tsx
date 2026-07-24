// ---> NEW:
import { useNavigate } from 'react-router-dom';
import { Coffee, FilePlus, Receipt, UserCheck } from 'lucide-react';
import styles from './EmployeeDashboard.module.css';

interface AttendanceStats {
  present: number;
  total: number;
  rate: number;
}

interface LeaveBalance {
  type: string;
  allocated: number;
  available: number;
}

interface RecentExpense {
  id: string;
  purpose: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const attendance: AttendanceStats = {
    present: 19,
    total: 20,
    rate: 95.0
  };

  const leaves: LeaveBalance[] = [
    { type: 'Annual Leave', allocated: 15, available: 11 },
    { type: 'Sick Leave', allocated: 8, available: 7 },
    { type: 'Casual Leave', allocated: 6, available: 4 },
  ];

  const expenses: RecentExpense[] = [
    { id: 'EXP-101', purpose: 'Client lunch meeting', amount: 120.0, date: '2026-07-20', status: 'Approved' },
    { id: 'EXP-102', purpose: 'Internet reimbursement', amount: 45.5, date: '2026-07-22', status: 'Pending' },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>Welcome to Your Portal</h1>
          <p className={styles.welcomeSubtitle}>View and manage your self-service statistics, leaves, and expenses.</p>
        </div>
        <div className={styles.quickActions}>
          <button 
            type="button"
            className={styles.primaryAction} 
            onClick={() => navigate('/portal/expenses')}
          >
            <FilePlus size={16} />
            <span>Claim Reimbursement</span>
          </button>
          <button 
            type="button"
            className={styles.secondaryAction} 
            onClick={() => navigate('/portal/leave')}
          >
            <Coffee size={16} />
            <span>Apply Leave</span>
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Attendance Card */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderTitle}>
              <UserCheck size={20} className={styles.iconBlue} />
              <h2>Attendance</h2>
            </div>
            <span className={styles.badge}>{attendance.rate}% Rate</span>
          </div>
          <div className={styles.attendanceBody}>
            <div className={styles.progressCircle}>
              <span className={styles.progressValue}>{attendance.present} / {attendance.total}</span>
            </div>
            <div className={styles.attendanceText}>
              <p>You were present <strong>{attendance.present}</strong> out of <strong>{attendance.total}</strong> days this month.</p>
            </div>
          </div>
        </section>

        {/* Leave Balance Card */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderTitle}>
              <Coffee size={20} className={styles.iconGreen} />
              <h2>Leave Balances</h2>
            </div>
          </div>
          <div className={styles.leaveList}>
            {leaves.map((leave) => (
              <div key={leave.type} className={styles.leaveItem}>
                <div className={styles.leaveMeta}>
                  <span>{leave.type}</span>
                  <strong>{leave.available} / {leave.allocated} Available</strong>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressBarInner} 
                    style={{ width: `${(leave.available / leave.allocated) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Expenses Card */}
        <section className={`${styles.card} ${styles.spanFull}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderTitle}>
              <Receipt size={20} className={styles.iconOrange} />
              <h2>Recent Expenses</h2>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Claim Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <div className={styles.purpose}>{exp.purpose}</div>
                      <small className={styles.date}>{exp.date}</small>
                    </td>
                    <td className={styles.amount}>${exp.amount.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.statusPill} ${styles[exp.status.toLowerCase()]}`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
