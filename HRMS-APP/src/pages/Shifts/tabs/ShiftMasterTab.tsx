// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import styles from './Tabs.module.css';
import ShiftTemplateModal from '../modals/ShiftTemplateModal';
import { shiftAdminApi } from '../../../services/shiftAdminApi';
import { useToast } from '../../../components/ToastContext';
import type { ShiftTemplate } from '../types';

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function ShiftMasterTab() {
  const { showToast } = useToast();

  // Component states
  const [shifts, setShifts] = useState<ShiftTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftTemplate | null>(null);

  /**
   * Refreshes list from backend database API.
   */
  const loadShifts = () => {
    setIsLoading(true);
    shiftAdminApi.getShifts()
      .then(data => {
        setShifts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to load shift templates.', 'error');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadShifts();
  }, []);

  /**
   * Handles saving new or modified shift templates.
   */
  const handleSave = (data: Omit<ShiftTemplate, 'id'>) => {
    if (selectedShift) {
      // Update
      shiftAdminApi.updateShift(selectedShift.id, data)
        .then(() => {
          showToast('Shift template updated successfully!', 'success');
          loadShifts();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to update shift template.', 'error');
        });
    } else {
      // Create
      shiftAdminApi.createShift(data)
        .then(() => {
          showToast('New shift template registered!', 'success');
          loadShifts();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to save shift template.', 'error');
        });
    }
    setIsModalOpen(false);
    setSelectedShift(null);
  };

  /**
   * Removes a shift template pattern.
   */
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this shift template? This may impact active assignments.')) {
      shiftAdminApi.deleteShift(id)
        .then(() => {
          showToast('Shift template deleted successfully.', 'success');
          loadShifts();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to delete shift template.', 'error');
        });
    }
  };

  const openAddModal = () => {
    setSelectedShift(null);
    setIsModalOpen(true);
  };

  const openEditModal = (shift: ShiftTemplate) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Tab Toolbar Row */}
      <div className={styles.headerRow}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Configure standard shift timings and overtime allowance rules.</span>
        <button 
          className={styles.primaryBtn}
          onClick={openAddModal}
          type="button"
        >
          <Plus size={18} /> Add Shift
        </button>
      </div>

      {/* Grid Layout Container */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading templates...</div>
      ) : shifts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No shift templates found. Click "+ Add Shift" to get started.</div>
      ) : (
        <div className={styles.shiftGrid}>
          {shifts.map((shift) => (
            <div key={shift.id} className={styles.shiftCard}>
              
              {/* Card Header Section */}
              <div className={styles.cardHeader}>
                <div className={styles.iconTitleGroup}>
                  <div className={styles.clockIconBox}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className={styles.shiftName}>{shift.name}</h3>
                    <span className={styles.shiftCode}>{shift.code}</span>
                  </div>
                </div>
                <div className={styles.actionIcons}>
                  <button 
                    type="button" 
                    className={styles.iconBtn}
                    onClick={() => openEditModal(shift)}
                    title="Edit shift settings"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(shift.id)}
                    title="Remove template"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Central Timings Prominence */}
              <div>
                <div className={styles.timingLabel}>Timing</div>
                <div className={styles.timingVal}>{shift.start_time} - {shift.end_time}</div>
              </div>

              {/* Lower Stat Grid Blocks */}
              <div className={styles.statsRow}>
                <div className={styles.statCol}>
                  <span className={styles.statLabel}>Duration</span>
                  <span className={styles.statVal}>{shift.duration_hours || 8} hrs</span>
                </div>
                <div className={styles.statCol}>
                  <span className={styles.statLabel}>Break</span>
                  <span className={styles.statVal}>{shift.break_mins} min</span>
                </div>
              </div>

              {/* Footer Overtime Pills */}
              {shift.allow_overtime && (
                <div className={styles.cardFooter}>
                  <span className={styles.overtimePill}>Overtime Allowed</span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Drawer Overlay Form */}
      <ShiftTemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedShift(null);
        }}
        onSave={handleSave}
        initialData={selectedShift}
      />
    </div>
  );
}
