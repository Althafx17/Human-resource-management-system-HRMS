// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, CheckCircle2, XCircle, AlertCircle, Calendar, Plus, MapPin, Users, Trash2, Eye, Download, Clock, X } from 'lucide-react';
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

  // Details Modal States
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Calculate dynamic KPIs from active records and lookups state with defensive fallbacks
  const totalWorkforce = Object.keys(employeeMap).length;
  const presentCount = records.filter(r => (r.status || '').toLowerCase() === 'present').length;
  const lateCount = records.filter(r => (r.status || '').toLowerCase() === 'late').length;
  const absentCount = records.filter(r => (r.status || '').toLowerCase() === 'absent').length;

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
          const emp = rec.employee ? employeeMap[String(rec.employee)] : null;
          return {
            id: rec.id || 0,
            name: emp ? emp.name : `Employee #${rec.employee || 'Unknown'}`,
            avatar: emp ? emp.avatar : getDeterministicMaleAvatar(rec.employee || 0),
            date: rec.date || '',
            checkIn: formatTime(rec.check_in),
            checkOut: formatTime(rec.check_out),
            status: rec.status || 'Present',
            location: rec.location || 'Main Office',
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
      location: data.location,
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

  /**
   * Handles deleting an attendance record by ID.
   */
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this attendance log?")) {
      attendanceApi.deleteAttendance(id)
        .then(() => {
          showToast('Attendance record deleted successfully!', 'success');
          loadAttendance();
        })
        .catch(err => {
          console.error('Delete Error:', err.response?.data || err.message);
          showToast('Failed to delete attendance record.', 'error');
        });
    }
  };

  // Perform client-side employee name string filters
  const filteredAttendance = records.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Attendance Management</h1>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* WORKFORCE */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workforce</span>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '4px 0 0 0' }}>{totalWorkforce}</h3>
          </div>
          <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
        </div>
        {/* PRESENT */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Present</span>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', margin: '4px 0 0 0' }}>{presentCount}</h3>
          </div>
          <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
        {/* LATE */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Late</span>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', margin: '4px 0 0 0' }}>{lateCount}</h3>
          </div>
          <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '8px', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
        </div>
        {/* ABSENT */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Absent</span>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', margin: '4px 0 0 0' }}>{absentCount}</h3>
          </div>
          <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={20} />
          </div>
        </div>
      </div>

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

          {/* Interactive Date Selection Picker & Export Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#475569',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onClick={() => {
                showToast('Attendance report exported to CSV!', 'success');
              }}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
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
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Loading attendance entries...
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                        <MapPin size={14} color="#94a3b8" />
                        <span>{record.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusPill} ${getStatusStyle(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span style={{ marginLeft: '4px' }}>{record.status}</span>
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          title="View details"
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            transition: 'all 0.2s',
                            outline: 'none'
                          }}
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          title="Delete record"
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            transition: 'all 0.2s',
                            outline: 'none'
                          }}
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

      {/* Attendance Details Modal Overlay */}
      {isDetailOpen && selectedRecord && (
        <div className={styles.modalOverlay} onClick={() => setIsDetailOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Attendance Details</span>
              <button 
                type="button" 
                className={styles.closeBtn} 
                onClick={() => setIsDetailOpen(false)}
                title="Close details"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className={styles.detailBody}>
              {/* Employee Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <img 
                  src={selectedRecord.avatar || ''} 
                  alt={selectedRecord.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{selectedRecord.name}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Log ID: #{selectedRecord.id}</p>
                </div>
              </div>

              {/* Status Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.statusPill} ${getStatusStyle(selectedRecord.status)}`}>
                  {getStatusIcon(selectedRecord.status)}
                  <span style={{ marginLeft: '4px' }}>{selectedRecord.status}</span>
                </span>
              </div>

              {/* Date Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Date</span>
                <span className={styles.detailValue}>{selectedRecord.date}</span>
              </div>

              {/* Check-In Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Check In</span>
                <span className={styles.detailValue} style={{ color: selectedRecord.checkIn === '--' ? '#94a3b8' : '#0f172a' }}>
                  {selectedRecord.checkIn}
                </span>
              </div>

              {/* Check-Out Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Check Out</span>
                <span className={styles.detailValue} style={{ color: selectedRecord.checkOut === '--' ? '#94a3b8' : '#0f172a' }}>
                  {selectedRecord.checkOut}
                </span>
              </div>

              {/* Location Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#94a3b8" />
                  {selectedRecord.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}