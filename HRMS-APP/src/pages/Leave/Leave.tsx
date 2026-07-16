import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, CheckCircle, Clock } from 'lucide-react';
import { leaveApi } from '../../apis/operations/leaveApi';
import styles from './Leave.module.css';

import ReviewLeaveRequest from '../../components/reviews/ReviewLeaveRequest';

interface LeaveRequest {
  id: string;
  employeeName: string;
  avatar: string;
  type: 'Sick Leave' | 'Casual Leave' | 'Annual Leave';
  startDate: string;
  endDate: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export default function Leave() {
  const [search, setSearch] = useState('');
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  useEffect(() => {
    leaveApi.getAll()
      .then(data => {
        const formatted: LeaveRequest[] = data.map((item: any) => ({
          id: String(item.id || item.leave_id || 'LR001'),
          employeeName: item.employeeName || item.employee_name || 'Angel Philip',
          avatar: item.avatar || 'https://i.pravatar.cc/150?u=3',
          type: item.type || item.leave_type || 'Annual Leave',
          startDate: item.startDate || item.start_date || '2026-06-22',
          endDate: item.endDate || item.end_date || '2026-06-26',
          days: Number(item.days || item.leave_days || 5),
          status: item.status || 'Pending'
        }));
        setLeaves(formatted);
      })
      .catch(err => console.error('Failed to load leaves:', err));
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved': return styles.approved;
      case 'Pending': return styles.pending;
      case 'Rejected': return styles.rejected;
      default: return '';
    }
  };

  const handleApprove = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' as const } : l));
  };

  const handleReject = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' as const } : l));
  };

  const filteredLeaves = leaves.filter(leave =>
    leave.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    leave.type.toLowerCase().includes(search.toLowerCase())
  );

  // Compute calculated values
  const approvedDays = leaves.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.days, 0);
  const pendingRequestsCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Leave Management</h1>

      {/* Quick Summary Cards Widgets Row */}
      <div className={styles.summaryRow}>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconGreen}`}><CheckCircle size={20} /></div>
          <div><h4>{approvedDays} Days</h4><p>Approved This Month</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconYellow}`}><Clock size={20} /></div>
          <div><h4>{pendingRequestsCount} Pending</h4><p>Awaiting Decision</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconBlue}`}><Calendar size={20} /></div>
          <div><h4>2 Employees</h4><p>On Leave Today</p></div>
        </div>
      </div>

      {/* Main Filter Action Header Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search requests..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Add Leave workflow coming soon!')}>
          <Plus size={18} /> Apply Leave
        </button>
      </div>

      {/* Request Log Sheet */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Duration</th>
              <th>Total Days</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((request) => (
              <tr 
                key={request.id} 
                onClick={() => setSelectedRequest(request)}
                style={{ cursor: 'pointer' }}
                title="Click to review request"
              >
                <td>{request.id}</td>
                <td>
                  <div className={styles.employeeCell}>
                    <img src={request.avatar} alt={request.employeeName} className={styles.avatar} />
                    <span className={styles.name}>{request.employeeName}</span>
                  </div>
                </td>
                <td className={styles.typeCell}>{request.type}</td>
                <td>{request.startDate} to {request.endDate}</td>
                <td>{request.days} {request.days === 1 ? 'day' : 'days'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReviewLeaveRequest
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest || undefined}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}