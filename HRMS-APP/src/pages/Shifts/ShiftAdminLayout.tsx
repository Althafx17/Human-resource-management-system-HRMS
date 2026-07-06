// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState } from 'react';
import { Settings, UserCheck, CalendarDays, Palmtree, Wrench } from 'lucide-react';
import styles from './ShiftAdminLayout.module.css';

// Importing settings tab views
import ShiftMasterTab from './tabs/ShiftMasterTab';
import AssignmentsTab from './tabs/AssignmentsTab';
import WeeklyOffsTab from './tabs/WeeklyOffsTab';
import HolidaysTab from './tabs/HolidaysTab';
import ResolverToolTab from './tabs/ResolverToolTab';

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
        <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {activeTab === 'master' && 'Shift Templates'}
            {activeTab === 'assignments' && 'Shift Assignments'}
            {activeTab === 'offs' && 'Weekly Offs Configuration'}
            {activeTab === 'holidays' && 'Holidays List'}
            {activeTab === 'resolver' && 'Schedule Resolver Tool'}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            {activeTab === 'master' && 'Define working hours, late grace rules, and overtime allowances.'}
            {activeTab === 'assignments' && 'Map active employees to shift templates and schedule effective dates.'}
            {activeTab === 'offs' && 'Manage weekly rest patterns and weekend definitions.'}
            {activeTab === 'holidays' && 'Configure calendar dates for mandatory and optional holidays.'}
            {activeTab === 'resolver' && 'Query and test active rules for a specific employee and target date.'}
          </p>
        </div>

        {/* Tab Content Components */}
        {activeTab === 'master' && <ShiftMasterTab />}
        {activeTab === 'assignments' && <AssignmentsTab />}
        {activeTab === 'offs' && <WeeklyOffsTab />}
        {activeTab === 'holidays' && <HolidaysTab />}
        {activeTab === 'resolver' && <ResolverToolTab />}
      </main>
    </div>
  );
}
