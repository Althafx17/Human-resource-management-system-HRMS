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
import { useAuthRole } from '../../contexts/AuthRoleContext';

// The exact list from your reference image with role-based access configurations
const menuItems = [
  { path: '/', label: 'Analytics', icon: LayoutGrid, allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { path: '/employees', label: 'Employees', icon: Users, allowedRoles: ['ADMIN', 'HR', 'MANAGER'] },
  { path: '/attendance', label: 'Attendance', icon: Clock, allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { path: '/work-areas', label: 'Work Areas', icon: MapPin, allowedRoles: ['ADMIN', 'HR', 'MANAGER'] },
  { path: '/shifts', label: 'Shift & Calendar', icon: Calendar, allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { path: '/leave', label: 'Leave', icon: Coffee, allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { path: '/overtime', label: 'Overtime', icon: Timer, allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { path: '/expenses', label: 'Expenses', icon: Receipt, allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { path: '/payroll', label: 'Payroll', icon: CreditCard, allowedRoles: ['ADMIN', 'HR'] },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  const { role } = useAuthRole();
  const currentUpperRole = (role || 'employee').toUpperCase();

  // ---> CHANGED: Filter links dynamically by active user role privileges
  const filteredMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(currentUpperRole)
  );

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
        {filteredMenuItems.map((item) => {
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