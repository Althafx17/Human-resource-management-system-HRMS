// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, CheckCircle2, XCircle, AlertCircle, Calendar, Plus } from 'lucide-react';
import styles from './attendence.module.css';
import LogAttendanceForm from '../../components/LogAttendanceForm';
import { attendanceApi } from '../../services/attendanceApi';
import { employeeApi } from '../../services/employeeApi';
import { getDeterministicMaleAvatar } from '../../utils/avatarUtils';
import { useToast } from '../../components/ToastContext';
import type { EmployeeData } from '../employees/types';
import type { AttendanceRecord } from './types';

// ==========================================
// 2. TYPES & HELPERS
// ==========================================

/**
 * Formats an ISO datetime string into user-friendly 12-hour AM/PM format.
 * 
 * @param {string | null} isoTimeStr - The raw ISO datetime timestamp from the API.
 * @returns {string} Formatted time string (e.g. "09:00 AM"), or "--" if null.
 */
const formatTime = (isoTimeStr: string | null | undefined): string => {
  if (!isoTimeStr) return '--';
  try {
    const date = new Date(isoTimeStr);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = String(minutes).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    return `${hoursStr}:${minutesStr} ${ampm}`;
  } catch (e) {
    return '--';
  }
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

/**
 * Attendance Component (Default Export)
 * 
 * Manages daily attendance records for the HRMS. Fetches real employee details 
 * and maps them back to the foreign keys returned by the attendance API endpoints.
 */
export default function Attendance() {
  const { showToast } = useToast();
  
  // Search and Drawer triggers
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selected date query (defaults to current date YYYY-MM-DD)
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Core records lists and lookup caching state
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, EmployeeData>>({});

  /**
   * Helper mapping standard attendance status strings to visual CSS modules classes.
   */
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Present': return styles.present;
      case 'Absent': return styles.absent;
      case 'Late': return styles.late;
      default: return '';
    }
  };

  /**
   * Helper rendering small status indicators next to status pills.
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle2 size={14} />;
      case 'Absent': return <XCircle size={14} />;
      case 'Late': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  // Fetch all employees once on component mount to build ID lookup map
  useEffect(() => {
    const loadAllEmployees = async () => {
      try {
        let allEmployees: EmployeeData[] = [];
        let page = 1;
        let hasMore = true;
        
        // Loop and load up to 10 pages of staff configurations to seed cache
        while (hasMore && page <= 10) {
          const data = await employeeApi.getAll(page);
          if (data.results && data.results.length > 0) {
            allEmployees = [...allEmployees, ...data.results];
            hasMore = !!data.next;
            page++;
          } else {
            hasMore = false;
          }
        }
        
        // Form lookup map
        const map: Record<string, EmployeeData> = {};
        allEmployees.forEach(emp => {
          map[String(emp.id)] = emp;
        });
        setEmployeeMap(map);
      } catch (err) {
        console.error('Failed to load employee lookups:', err);
      }
    };
    loadAllEmployees();
  }, []);

  /**
   * Fetches daily attendance records from the backend API for the active currentDate.
   */
  const loadAttendance = () => {
    setIsLoading(true);
    // Fetch logs filtered by date query parameter
    attendanceApi.getAttendanceRecords(undefined, currentDate)
      .then(res => {
        const results = res.results || [];
        const mapped: AttendanceRecord[] = results.map(rec => {
          const emp = employeeMap[String(rec.employee)];
          return {
            id: rec.id || 0,
            name: emp ? emp.name : `Employee #${rec.employee}`,
            avatar: emp ? emp.avatar : getDeterministicMaleAvatar(rec.employee),
            date: rec.date,
            checkIn: formatTime(rec.check_in),
            checkOut: formatTime(rec.check_out),
            status: rec.status,
          };
        });
        setRecords(mapped);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch attendance:', err);
        setIsLoading(false);
      });
  };

  // Trigger attendance reload whenever the selected date or lookup map changes
  useEffect(() => {
    loadAttendance();
  }, [currentDate, employeeMap]);

  /**
   * Formats local form time selections into ISO UTC datetimes and submits to the API.
   * 
   * @param {any} data - Form entry fields returned by the SlideOverDrawer form.
   */
  const handleSave = (data: any) => {
    // Generate ISO timestamps: HTML time values are in "HH:MM" format
    const isoCheckIn = data.checkIn && data.checkIn !== '--' ? `${data.date}T${data.checkIn}:00Z` : null;
    const isoCheckOut = data.checkOut && data.checkOut !== '--' ? `${data.date}T${data.checkOut}:00Z` : null;

    const payload = {
      date: data.date,
      status: data.status,
      employee: Number(data.employeeId),
      check_in: isoCheckIn,
      check_out: isoCheckOut,
    };

    attendanceApi.logAttendance(payload)
      .then(() => {
        showToast('Attendance logged successfully!', 'success');
        // Refresh the attendance table list
        loadAttendance();
      })
      .catch(err => {
        console.error('Save Error:', err.response?.data || err.message);
        showToast('Failed to log attendance record.', 'error');
      });
  };

  // Perform client-side employee name string filters
  const filteredAttendance = records.filter(emp =>
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
            <button 
              type="button"
              className={styles.logBtn}
              onClick={() => setIsDrawerOpen(true)}
            >
              <Plus size={16} /> Log Attendance
            </button>
          </div>

          {/* Interactive Date Selection Picker */}
          <div className={styles.dateDisplay}>
            <Calendar size={18} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong>Date:</strong>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#1a3646',
                  fontWeight: '600',
                  outline: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              />
            </span>
          </div>
        </div>

        {/* Attendance Main Table Grid */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Loading attendance entries...
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No attendance logs found for this date.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>#{record.id}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Log Attendance Form Slide-out Drawer */}
      <LogAttendanceForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}