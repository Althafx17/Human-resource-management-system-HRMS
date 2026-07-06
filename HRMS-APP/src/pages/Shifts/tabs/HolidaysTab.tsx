// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import styles from './Tabs.module.css';
import HolidayModal from '../modals/HolidayModal';
import { shiftAdminApi } from '../../../services/shiftAdminApi';
import { useToast } from '../../../components/ToastContext';
import type { Holiday } from '../types';

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function HolidaysTab() {
  const { showToast } = useToast();

  // Component states
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Refreshes holidays list from storage.
   */
  const loadHolidays = () => {
    setIsLoading(true);
    shiftAdminApi.getHolidays()
      .then(data => {
        // Sort holidays chronologically
        const sorted = data.sort((a, b) => a.date.localeCompare(b.date));
        setHolidays(sorted);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to load holidays.', 'error');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  /**
   * Registers a new calendar holiday.
   */
  const handleSave = (data: Omit<Holiday, 'id'>) => {
    shiftAdminApi.createHoliday(data)
      .then(() => {
        showToast('Holiday added successfully!', 'success');
        loadHolidays();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to register holiday.', 'error');
      });
    setIsModalOpen(false);
  };

  /**
   * Removes a holiday by ID.
   */
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to remove this holiday?')) {
      shiftAdminApi.deleteHoliday(id)
        .then(() => {
          showToast('Holiday removed successfully.', 'success');
          loadHolidays();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to delete holiday.', 'error');
        });
    }
  };

  /**
   * Helper utility rendering verbose dates (e.g. "Monday, January 1, 2026")
   */
  const formatVerboseDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Header bar */}
      <div className={styles.headerRow}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Configure national holidays, local branch closures, and optional calendar leaves.</span>
        <button 
          className={styles.primaryBtn}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <Plus size={18} /> Add Holiday
        </button>
      </div>

      {/* Holidays ledger list table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading holidays calendar...</div>
      ) : holidays.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No holidays registered on the calendar. Click "+ Add Holiday" to add dates.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Holiday Details</th>
                <th>Calendar Date</th>
                <th>Scope</th>
                <th>Type Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday.id}>
                  {/* Title & Icon Cell */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Calendar size={16} />
                      </div>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{holiday.name}</span>
                    </div>
                  </td>

                  {/* Formatted Date Cell */}
                  <td>
                    <span style={{ fontSize: '13px', color: '#334155' }}>
                      {formatVerboseDate(holiday.date)}
                    </span>
                  </td>

                  {/* Applicability Scope Cell */}
                  <td>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {holiday.applicable_scope}
                    </span>
                  </td>

                  {/* Optional/Mandatory Status Pill Badges */}
                  <td>
                    <span className={`${styles.badge}`} style={{
                      backgroundColor: holiday.is_optional ? '#f3f4f6' : '#fee2e2',
                      color: holiday.is_optional ? '#475569' : '#991b1b'
                    }}>
                      {holiday.is_optional ? 'OPTIONAL' : 'MANDATORY'}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(holiday.id)}
                      title="Remove holiday"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-out Add Holiday Drawer */}
      <HolidayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
