// ---> NEW:
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Clock,
  Coffee,
  Receipt,
  ChevronRight,
  Menu
} from 'lucide-react';
import styles from './Sidebar.module.css';

const menuItems = [
  { path: '/portal/dashboard', label: 'My Dashboard', icon: LayoutGrid },
  { path: '/portal/attendance', label: 'My Attendance', icon: Clock },
  { path: '/portal/leave', label: 'My Leaves', icon: Coffee },
  { path: '/portal/expenses', label: 'My Expenses', icon: Receipt },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function EmployeeSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoContainer}>
        {!isCollapsed && <h1 className={styles.brandName}>Portal</h1>}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.toggleBtn}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''} ${isCollapsed ? styles.navItemCollapsed : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={styles.itemContent}>
                <Icon size={20} className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>{item.label}</span>}
              </div>
              {isActive && !isCollapsed && <ChevronRight size={18} className={styles.chevron} />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
