import { useState } from 'react';
import { Search, SlidersHorizontal, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';
import styles from './attendence.module.css';

type AttendanceStatus = 'Present' | 'Absent' | 'Late';

interface AttendanceRecord {
  id: string;
  name: string;
  avatar: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
}


// TypeScript reference interface structure
// interface AttendanceData {
//   id: string;
//   name: string;
//   avatar: string;
//   date: string;
//   checkIn: string;
//   checkOut: string;
//   status: 'Present' | 'Absent' | 'Late';
// }

const DUMMY_ATTENDANCE: AttendanceRecord[] = [
  { id: 'EMP001', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1', date: '2026-06-19', checkIn: '09:00 AM', checkOut: '05:30 PM', status: 'Present' },
  { id: 'EMP002', name: 'Sara John', avatar: 'https://i.pravatar.cc/150?u=2', date: '2026-06-19', checkIn: '09:15 AM', checkOut: '05:30 PM', status: 'Present' },
  { id: 'EMP003', name: 'Angel Philip', avatar: 'https://i.pravatar.cc/150?u=3', date: '2026-06-19', checkIn: '--', checkOut: '--', status: 'Absent' },
  { id: 'EMP004', name: 'Anmariya', avatar: 'https://i.pravatar.cc/150?u=4', date: '2026-06-19', checkIn: '09:45 AM', checkOut: '05:30 PM', status: 'Late' },
  { id: 'EMP005', name: 'Augestien', avatar: 'https://i.pravatar.cc/150?u=5', date: '2026-06-19', checkIn: '--', checkOut: '--', status: 'Absent' },
];

export default function Attendance() {
  const [search, setSearch] = useState('');

  const getStatusStyle = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present': return styles.present;
      case 'Absent': return styles.absent;
      case 'Late': return styles.late;
      default: return '';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present': return <CheckCircle2 size={14} />;
      case 'Absent': return <XCircle size={14} />;
      case 'Late': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  const filteredAttendance = DUMMY_ATTENDANCE.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Attendance Management</h1>

      <div className={styles.card}>
        {/* Search and Tool Belt Row */}
        <div className={styles.toolbar}>
          <div className={styles.searchGroup}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Search employee..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.filterBtn}
              aria-label="Filter attendance"
              title="Filter attendance"
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.dateDisplay}>
            <Calendar size={18} />
            <span>Today: <strong>June 19, 2026</strong></span>
          </div>
        </div>

        {/* Attendance Main Table Grid */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>
                    <div className={styles.employeeCell}>
                      <img src={record.avatar} alt={record.name} className={styles.avatar} />
                      <span className={styles.empName}>{record.name}</span>
                    </div>
                  </td>
                  <td>{record.date}</td>
                  <td className={record.checkIn === '--' ? styles.mutedText : ''}>{record.checkIn}</td>
                  <td className={record.checkOut === '--' ? styles.mutedText : ''}>{record.checkOut}</td>
                  <td>
                    <span className={`${styles.statusPill} ${getStatusStyle(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span style={{ marginLeft: '4px' }}>{record.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}