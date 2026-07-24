// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Search, CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import styles from './Tabs.module.css';
import { employeeApi } from '../../../apis/core/employeeApi';
import { shiftAdminApi } from '../../../apis/core/shiftAdminApi';
import type { EmployeeData } from '../../employees/types';
import type { ResolverResponse } from '../types';

// ==========================================
// 2. MAIN RESOLVER TOOL TAB COMPONENT
// ==========================================
export default function ResolverToolTab() {
  // Query dropdown options state
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Form parameters
  const [employeeId, setEmployeeId] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Resolution results state
  const [isResolving, setIsResolving] = useState(false);
  const [result, setResult] = useState<ResolverResponse | null>(null);

  // Seed employee lookups
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setIsLoadingList(true);
    });

    const employeeRequests = Array.from({ length: 10 }, (_, i) => employeeApi.getAll(i + 1).catch(() => null));
    Promise.all(employeeRequests)
      .then(res => {
        if (!active) return;
        const flattenedEmps: EmployeeData[] = [];
        res.forEach(item => {
          if (item && item.results) {
            flattenedEmps.push(...item.results);
          }
        });
        setEmployees(flattenedEmps);
        if (flattenedEmps.length > 0) setEmployeeId(String(flattenedEmps[0].id));
        setIsLoadingList(false);
      })
      .catch(err => {
        console.error('Failed to load employees for resolver:', err);
        if (active) setIsLoadingList(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /**
   * Resolves schedule variables for chosen parameters.
   */
  const handleResolve = () => {
    if (!employeeId || !targetDate) {
      alert('Please select both an employee and a target date.');
      return;
    }
    setIsResolving(true);
    shiftAdminApi.resolveStatus(employeeId, targetDate)
      .then(res => {
        setResult(res);
        setIsResolving(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to resolve rules on backend API.');
        setIsResolving(false);
      });
  };

  /**
   * Helper mapping resolved statuses to appropriate visual helper styles.
   */
  const getStatusStyleClass = (status: string) => {
    if (status === 'Working Day') return styles.statusHeader;
    if (status === 'Holiday') return `${styles.statusHeader} ${styles.statusHoliday}`;
    return `${styles.statusHeader} ${styles.statusOff}`;
  };

  /**
   * Helper rendering matching Lucide status icon descriptors.
   */
  const getStatusIcon = (status: string) => {
    if (status === 'Working Day') return <CheckCircle2 size={24} color="#16a34a" />;
    if (status === 'Holiday') return <AlertCircle size={24} color="#d97706" />;
    return <XCircle size={24} color="#4b5563" />;
  };

  return (
    <div>
      <div className={styles.splitLayout}>
        
        {/* Left Column: Query parameters panel */}
        <div className={styles.pane}>
          <div className={styles.paneTitle}>Query Parameters</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            {/* Employee Dropdown Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Employee *</label>
              <select
                style={{
                  padding: '10px',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isLoadingList}
              >
                <option value="">Select Employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employeeCode || `#${emp.id}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Datepicker Target Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Target Date *</label>
              <input
                type="date"
                style={{
                  padding: '10px',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div style={{ flex: 1 }}></div>

            {/* Submit Control */}
            <button
              className={styles.primaryBtn}
              onClick={handleResolve}
              disabled={isResolving || isLoadingList}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              type="button"
            >
              {isResolving ? 'Resolving...' : 'Resolve Status'}
            </button>
          </div>
        </div>

        {/* Right Column: Resolved output results panel */}
        <div className={styles.pane}>
          <div className={styles.paneTitle}>Resolution Result</div>

          {!result ? (
            /* Empty Mock state */
            <div className={styles.emptyState}>
              <Search size={48} strokeWidth={1.5} />
              <div className={styles.emptyText}>Enter details and click resolve to see result</div>
            </div>
          ) : (
            /* Success mapping results state */
            <div className={styles.resultCard}>
              
              {/* Main Status header indicator */}
              <div className={getStatusStyleClass(result.status)}>
                {getStatusIcon(result.status)}
                <span>{result.status}</span>
              </div>

              {/* Resolved Stats Rows */}
              <div className={styles.resultGrid}>
                
                {/* Expected Hours column */}
                <div className={styles.statCol} style={{ borderRight: '1px solid #f1f5f9' }}>
                  <span className={styles.statLabel} style={{ fontSize: '11px' }}>Expected Hours</span>
                  <span className={styles.statVal} style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                    {result.expected_hours}
                  </span>
                </div>

                {/* Assigned Schedule Shift Column */}
                <div className={styles.statCol}>
                  <span className={styles.statLabel} style={{ fontSize: '11px' }}>Assigned Shift</span>
                  <span className={styles.shiftMatchText}>
                    {result.assigned_shift_name}
                  </span>
                </div>

              </div>

              {/* Help guide tip pill */}
              <div style={{
                marginTop: 'auto',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}>
                <HelpCircle size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  This resolution resolves active employee assignments chronologically, overriding default company weekend patterns or registered calendar holidays.
                </span>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
