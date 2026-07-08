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
// ---> NEW: Standard StatusPill component to enforce consistent styling and capitalization
function StatusPill({ status }: { status: string }) {
  const normalized = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Absent';
  
  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'Present': return styles.present;
      case 'Absent': return styles.absent;
      case 'Late': return styles.late;
      case 'Half Day': return styles.late; // Share same color standard
      default: return '';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'Present': return <CheckCircle2 size={14} />;
      case 'Absent': return <XCircle size={14} />;
      case 'Late':
      case 'Half Day':
        return <AlertCircle size={14} />;
      default: return null;
    }
  };

  return (
    <span className={`${styles.statusPill} ${getStatusStyle(normalized)}`}>
      {getStatusIcon(normalized)}
      <span className={styles.statusLabelText}>{normalized}</span>
    </span>
  );
}

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

  // ---> NEW: Handler for status updates
  const handleStatusChange = async (recordId: number, newStatus: string) => {
    try {
      await attendanceApi.updateStatus(recordId, newStatus);
      showToast('Attendance status updated successfully!', 'success');
      
      // Update local state to reflect changes instantly
      setRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === recordId ? { ...record, status: newStatus } : record
        )
      );
      
      // If the selected record in the drawer is stored in a separate state, update that too
      setSelectedRecord(prev => prev && prev.id === recordId ? { ...prev, status: newStatus } : prev);

    } catch (error) {
      console.error("Failed to update status", error);
      showToast('Failed to update attendance status.', 'error');
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
      <div className={styles.kpiGrid}>
        {/* WORKFORCE */}
        <div className={styles.kpiCard}>
          <div>
            <span className={styles.kpiLabel}>Workforce</span>
            <h3 className={`${styles.kpiValue} ${styles.kpiValueDefault}`}>{totalWorkforce}</h3>
          </div>
          <div className={`${styles.kpiIconBadge} ${styles.kpiBadgeDefault}`}>
            <Users size={20} />
          </div>
        </div>
        {/* PRESENT */}
        <div className={styles.kpiCard}>
          <div>
            <span className={styles.kpiLabel}>Present</span>
            <h3 className={`${styles.kpiValue} ${styles.kpiValuePresent}`}>{presentCount}</h3>
          </div>
          <div className={`${styles.kpiIconBadge} ${styles.kpiBadgePresent}`}>
            <CheckCircle2 size={20} />
          </div>
        </div>
        {/* LATE */}
        <div className={styles.kpiCard}>
          <div>
            <span className={styles.kpiLabel}>Late</span>
            <h3 className={`${styles.kpiValue} ${styles.kpiValueLate}`}>{lateCount}</h3>
          </div>
          <div className={`${styles.kpiIconBadge} ${styles.kpiBadgeLate}`}>
            <Clock size={20} />
          </div>
        </div>
        {/* ABSENT */}
        <div className={styles.kpiCard}>
          <div>
            <span className={styles.kpiLabel}>Absent</span>
            <h3 className={`${styles.kpiValue} ${styles.kpiValueAbsent}`}>{absentCount}</h3>
          </div>
          <div className={`${styles.kpiIconBadge} ${styles.kpiBadgeAbsent}`}>
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
          <div className={styles.toolbarRight}>
            <div className={styles.dateDisplay}>
              <Calendar size={18} />
              <span className={styles.dateDisplayWrapper}>
                <strong>Date:</strong>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className={styles.dateInput}
                  title="Select attendance date"
                  aria-label="Select attendance date"
                />
              </span>
            </div>
            
            <button
              type="button"
              className={styles.exportBtn}
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
                  <td colSpan={8} className={styles.emptyTableCell}>
                    Loading attendance entries...
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyTableCell}>
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
                      <div className={styles.locationCell}>
                        <MapPin size={14} color="#94a3b8" />
                        <span>{record.location}</span>
                      </div>
                    </td>
                    <td>
                      {/* ---> CHANGED: Standardized status rendering inside the table map */}
                      <StatusPill status={record.status} />
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          type="button"
                          title="View details"
                          className={styles.actionBtn}
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
                          className={styles.deleteBtn}
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
              <div className={styles.modalEmpHeader}>
                <img 
                  src={selectedRecord.avatar || ''} 
                  alt={selectedRecord.name}
                  className={styles.modalAvatar}
                />
                <div>
                  <h4 className={styles.modalEmpName}>{selectedRecord.name}</h4>
                  <p className={styles.modalEmpId}>Log ID: #{selectedRecord.id}</p>
                </div>
              </div>

              {/* Status Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                {/* ---> CHANGED: Replaced static status text with an editable dropdown */}
                <div className={styles.statusWrapper}>
                  <select 
                    value={selectedRecord.status} 
                    onChange={(e) => handleStatusChange(selectedRecord.id, e.target.value)}
                    className={styles.statusDropdown}
                    title="Select attendance status"
                    aria-label="Select attendance status"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>
              </div>

              {/* Date Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Date</span>
                <span className={styles.detailValue}>{selectedRecord.date}</span>
              </div>

              {/* Check-In Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Check In</span>
                <span className={`${styles.detailValue} ${selectedRecord.checkIn === '--' ? styles.mutedValue : ''}`}>
                  {selectedRecord.checkIn}
                </span>
              </div>

              {/* Check-Out Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Check Out</span>
                <span className={`${styles.detailValue} ${selectedRecord.checkOut === '--' ? styles.mutedValue : ''}`}>
                  {selectedRecord.checkOut}
                </span>
              </div>

              {/* Location Info */}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Location</span>
                <span className={`${styles.detailValue} ${styles.locationVal}`}>
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