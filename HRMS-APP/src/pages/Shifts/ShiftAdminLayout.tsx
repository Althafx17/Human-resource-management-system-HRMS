// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState } from 'react';
import { Settings, UserCheck, CalendarDays, Palmtree, Wrench } from 'lucide-react';
import styles from './ShiftAdminLayout.module.css';

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

/**
 * ShiftAdminLayout Component (Default Export)
 * 
 * Renders the Time & Attendance scheduling settings layout. Features an inner-sidebar 
 * navigation pane on the left and dynamic content areas on the right.
 */
export default function ShiftAdminLayout() {
  // Active settings tab state
  const [activeTab, setActiveTab] = useState<'master' | 'assignments' | 'offs' | 'holidays' | 'resolver'>('master');

  const menuItems = [
    { id: 'master', label: 'Shift Master', icon: <Settings size={18} /> },
    { id: 'assignments', label: 'Assignments', icon: <UserCheck size={18} /> },
    { id: 'offs', label: 'Weekly Offs', icon: <CalendarDays size={18} /> },
    { id: 'holidays', label: 'Holidays', icon: <Palmtree size={18} /> },
    { id: 'resolver', label: 'Resolver Tool', icon: <Wrench size={18} /> },
  ] as const;

  return (
    <div className={styles.container}>
      {/* Inner Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Settings & Schedules</div>
        {menuItems.map(item => (
          <button
            key={item.id}
            type="button"
            className={`${styles.menuItem} ${activeTab === item.id ? styles.activeItem : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Dynamic Content Panel */}
      <main className={styles.content}>
        {activeTab === 'master' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Shift Templates Master</h2>
            <p style={{ color: '#64748b' }}>Configure standard shift timings and overtime options here.</p>
          </div>
        )}
        {activeTab === 'assignments' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Shift Assignments</h2>
            <p style={{ color: '#64748b' }}>Assign shift patterns to employees and schedule effective dates.</p>
          </div>
        )}
        {activeTab === 'offs' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Weekly Offs Configuration</h2>
            <p style={{ color: '#64748b' }}>Manage weekly recurring rest days and scopes.</p>
          </div>
        )}
        {activeTab === 'holidays' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Holidays List</h2>
            <p style={{ color: '#64748b' }}>Configure optional and statutory holiday listings.</p>
          </div>
        )}
        {activeTab === 'resolver' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Schedule Resolver Tool</h2>
            <p style={{ color: '#64748b' }}>Inspect expected workday shifts and details for individual dates.</p>
          </div>
        )}
      </main>
    </div>
  );
}
