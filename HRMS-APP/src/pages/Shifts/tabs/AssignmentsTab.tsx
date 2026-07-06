// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './Tabs.module.css';
import AssignShiftModal from '../modals/AssignShiftModal';
import { shiftAdminApi } from '../../../services/shiftAdminApi';
import { employeeApi } from '../../../services/employeeApi';
import { useToast } from '../../../components/ToastContext';
import { getDeterministicMaleAvatar } from '../../../utils/avatarUtils';
import type { EmployeeData } from '../../employees/types';
import type { ShiftTemplate, ShiftAssignment } from '../types';

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function AssignmentsTab() {
  const { showToast } = useToast();

  // Data lists and lookups cache state
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [shifts, setShifts] = useState<ShiftTemplate[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, EmployeeData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Loads lookups and schedules simultaneously.
   */
  const loadData = () => {
    setIsLoading(true);
    
    // Seed employee profile list caching up to page 10
    const employeeRequests = Array.from({ length: 10 }, (_, i) => employeeApi.getAll(i + 1).catch(() => null));
    
    Promise.all([
      Promise.all(employeeRequests),
      shiftAdminApi.shifts.getAll(),
      shiftAdminApi.getAssignments()
    ]).then(([employeeResults, shiftResults, assignmentResults]) => {
      // Assemble employee lookup map
      const map: Record<string, EmployeeData> = {};
      employeeResults.forEach(res => {
        if (res && res.results) {
          res.results.forEach(emp => {
            map[String(emp.id)] = emp;
          });
        }
      });
      
      setEmployeeMap(map);
      setShifts(shiftResults);
      setAssignments(assignmentResults);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      showToast('Failed to load shift assignments data.', 'error');
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Registers a new shift assignment rule.
   */
  const handleSave = (data: Omit<ShiftAssignment, 'id'>) => {
    shiftAdminApi.createAssignment(data)
      .then(() => {
        showToast('Shift assigned successfully!', 'success');
        loadData();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to assign shift.', 'error');
      });
    setIsModalOpen(false);
  };

  /**
   * Deletes a dated assignment.
   */
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to remove this shift assignment?')) {
      shiftAdminApi.deleteAssignment(id)
        .then(() => {
          showToast('Shift assignment removed successfully.', 'success');
          loadData();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to remove assignment.', 'error');
        });
    }
  };

  return (
    <div>
      {/* Toolbar Headers */}
      <div className={styles.headerRow}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Map active staff members to shift templates and activation rules.</span>
        <button 
          className={styles.primaryBtn}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <Plus size={18} /> Assign Shift
        </button>
      </div>

      {/* Ledger Table Layout */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No shift assignments scheduled. Click "+ Assign Shift" to map employees.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Shift Schedule</th>
                <th>Assignment Type</th>
                <th>Effective From</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => {
                const emp = employeeMap[String(assignment.employee_id)];
                const shift = shifts.find(s => s.id === assignment.shift_id);
                
                return (
                  <tr key={assignment.id}>
                    {/* Employee Profile Cell */}
                    <td>
                      <div className={styles.empCell}>
                        <img 
                          className={styles.avatar}
                          src={emp?.avatar || getDeterministicMaleAvatar(assignment.employee_id)}
                          alt={emp?.name || 'Employee'}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{emp?.name || `Employee #${assignment.employee_id}`}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{emp?.designation || 'Staff'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Shift Pattern Match */}
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{shift?.name || `Shift #${assignment.shift_id}`}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Timing: {shift ? `${shift.start_time} - ${shift.end_time}` : '--'}
                        </div>
                      </div>
                    </td>

                    {/* Rules Pill Badge */}
                    <td>
                      <span className={`${styles.badge} ${assignment.assignment_type === 'Regular' ? styles.badgePrimary : styles.badgeSecondary}`}>
                        {assignment.assignment_type}
                      </span>
                    </td>

                    {/* Dates Column */}
                    <td>
                      <span style={{ fontSize: '13px', color: '#475569' }}>{assignment.effective_from}</span>
                    </td>

                    {/* Table Actions Column */}
                    <td>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(assignment.id)}
                        title="Remove assignment"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-out modal */}
      <AssignShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
