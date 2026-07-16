import { useState } from 'react';
import { Search, Plus, Clock, DollarSign, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from './Overtime.module.css';

import ReviewOvertime from '../../components/reviews/ReviewOvertime';

interface OvertimeRecord {
  id: string;
  employeeName: string;
  avatar: string;
  date: string;
  hoursLogged: number;
  multiplier: number; // e.g., 1.5x, 2.0x rate
  estPayout: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const DUMMY_OVERTIME: OvertimeRecord[] = [
  { id: 'OT001', employeeName: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1', date: '2026-06-18', hoursLogged: 3.5, multiplier: 1.5, estPayout: 105.00, status: 'Approved' },
  { id: 'OT002', employeeName: 'Anmariya', avatar: 'https://i.pravatar.cc/150?u=4', date: '2026-06-19', hoursLogged: 2.0, multiplier: 1.5, estPayout: 60.00, status: 'Pending' },
  { id: 'OT003', employeeName: 'Sara John', avatar: 'https://i.pravatar.cc/150?u=2', date: '2026-06-19', hoursLogged: 4.0, multiplier: 2.0, estPayout: 160.00, status: 'Approved' },
  { id: 'OT004', employeeName: 'Augestien', avatar: 'https://i.pravatar.cc/150?u=5', date: '2026-06-15', hoursLogged: 1.5, multiplier: 1.5, estPayout: 45.00, status: 'Rejected' },
];

export default function Overtime() {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<OvertimeRecord[]>(DUMMY_OVERTIME);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRecord | null>(null);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved': return styles.approved;
      case 'Pending': return styles.pending;
      case 'Rejected': return styles.rejected;
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={14} />;
      case 'Pending': return <AlertCircle size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      default: return null;
    }
  };

  const handleApprove = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r));
  };

  const handleReject = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' as const } : r));
  };

  const filteredRecords = records.filter(record =>
    record.employeeName.toLowerCase().includes(search.toLowerCase())
  );

  // Total calculation aggregates
  const totalHours = records.reduce((sum, item) => item.status === 'Approved' ? sum + item.hoursLogged : sum, 0);
  const totalPayout = records.reduce((sum, item) => item.status === 'Approved' ? sum + item.estPayout : sum, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Overtime Tracking</h1>

      {/* Overview Analytics Matrix */}
      <div className={styles.summaryRow}>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconBlue}`}><Clock size={20} /></div>
          <div><h4>{totalHours} hrs</h4><p>Approved OT (This Month)</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconGreen}`}><DollarSign size={20} /></div>
          <div><h4>${totalPayout.toFixed(2)}</h4><p>Total Estimated Cost</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconYellow}`}><TrendingUp size={20} /></div>
          <div><h4>1.5x - 2.0x</h4><p>Active Standard Rates</p></div>
        </div>
      </div>

      {/* Toolbar Control Block */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search employee overtime..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.primaryBtn}>
          <Plus size={18} /> Log Overtime
        </button>
      </div>

      {/* Overtime Ledger Table Sheet */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Hours Logged</th>
              <th>Rate Multiplier</th>
              <th>Est. Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr 
                key={record.id}
                onClick={() => setSelectedRequest(record)}
                style={{ cursor: 'pointer' }}
                title="Click to review request"
              >
                <td>{record.id}</td>
                <td>
                  <div className={styles.employeeCell}>
                    <img src={record.avatar} alt={record.employeeName} className={styles.avatar} />
                    <span className={styles.name}>{record.employeeName}</span>
                  </div>
                </td>
                <td>{record.date}</td>
                <td className={styles.boldText}>{record.hoursLogged} hrs</td>
                <td><span className={styles.multiplierTag}>{record.multiplier}x</span></td>
                <td className={styles.payoutCell}>${record.estPayout.toFixed(2)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(record.status)}`}>
                    {getStatusIcon(record.status)}
                    <span style={{ marginLeft: '6px' }}>{record.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReviewOvertime
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest || undefined}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}