// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './Tabs.module.css';
import WeeklyOffModal from '../modals/WeeklyOffModal';
import { shiftAdminApi } from '../../../apis/core/shiftAdminApi';
import { useToast } from '../../../contexts/ToastContext';
import type { WeeklyOffRule } from '../types';

// Seven weekdays header indexes
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function WeeklyOffsTab() {
  const { showToast } = useToast();

  // Rule states
  const [rules, setRules] = useState<WeeklyOffRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Refreshes rules from localStorage mock API.
   */
  const loadRules = () => {
    setIsLoading(true);
    shiftAdminApi.getWeeklyOffs()
      .then(data => {
        setRules(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to load weekly off rules.', 'error');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadRules();
  }, []);

  /**
   * Saves a new weekly off rest day rule.
   */
  const handleSave = (data: Omit<WeeklyOffRule, 'id'>) => {
    shiftAdminApi.createWeeklyOff(data)
      .then(() => {
        showToast('Weekly off rule created successfully!', 'success');
        loadRules();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to create weekly off rule.', 'error');
      });
    setIsModalOpen(false);
  };

  /**
   * Removes a rule by ID.
   */
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this weekly off rule?')) {
      shiftAdminApi.deleteWeeklyOff(id)
        .then(() => {
          showToast('Weekly off rule removed successfully.', 'success');
          loadRules();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to remove weekly off rule.', 'error');
        });
    }
  };

  return (
    <div>
      {/* Toolbar header */}
      <div className={styles.headerRow}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Configure weekly rest days, rotative calendars, and company-wide weekend breaks.</span>
        <button 
          className={styles.primaryBtn}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <Plus size={18} /> Add Rule
        </button>
      </div>

      {/* Rules list matrix */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading weekly off rules...</div>
      ) : rules.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No weekly off rules configured. Click "+ Add Rule" to define rest days.</div>
      ) : (
        <div className={styles.weeklyOffList}>
          {rules.map((rule) => (
            <div key={rule.id} className={styles.offCard}>
              
              {/* Card Title & Meta Scope pills */}
              <div className={styles.offCardHeader}>
                <div>
                  <h3 className={styles.shiftName} style={{ fontSize: '16px' }}>{rule.rule_name}</h3>
                  <div className={styles.ruleMeta}>
                    <span className={styles.badge} style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                      {rule.pattern_type}
                    </span>
                    <span className={styles.badge} style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                      {rule.applicable_scope}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDelete(rule.id)}
                  title="Remove rule"
                  style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Day Circle row (Highlights selected rest days in light red badge) */}
              <div className={styles.daysRow}>
                {DAYS_OF_WEEK.map((day) => {
                  const isOff = rule.active_days.includes(day);
                  return (
                    <div
                      key={day}
                      className={`${styles.dayCircle} ${isOff ? styles.dayCircleActive : ''}`}
                      title={isOff ? `${day} (Designated Rest Day)` : `${day} (Work Day)`}
                    >
                      {day[0]}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Overlay Form drawer */}
      <WeeklyOffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
