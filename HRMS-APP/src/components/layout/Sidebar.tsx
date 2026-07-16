import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Clock,
  MapPin,
  Calendar,
  Coffee,
  Timer,
  Receipt,
  CreditCard,
  ChevronRight,
  Menu
} from 'lucide-react';
import styles from './Sidebar.module.css';

// The exact list from your reference image
const menuItems = [
  { path: '/', label: 'Analytics', icon: LayoutGrid },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/attendance', label: 'Attendance', icon: Clock },
  { path: '/work-areas', label: 'Work Areas', icon: MapPin },
  { path: '/shifts', label: 'Shift & Calendar', icon: Calendar },
  { path: '/leave', label: 'Leave', icon: Coffee },
  { path: '/overtime', label: 'Overtime', icon: Timer },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/payroll', label: 'Payroll', icon: CreditCard },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoContainer}>
        {!isCollapsed && <h1 className={styles.brandName}>HRMS APP</h1>}
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
          // Checks if the current URL matches the item's path
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
              
              {/* Only show the chevron arrow if the item is active and sidebar is expanded */}
              {isActive && !isCollapsed && <ChevronRight size={18} className={styles.chevron} />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}