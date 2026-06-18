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
  ChevronRight
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

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <h1 className={styles.brandName}>Bisidiq Solution</h1>
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
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.itemContent}>
                <Icon size={20} className={styles.icon} />
                <span className={styles.label}>{item.label}</span>
              </div>
              
              {/* Only show the chevron arrow if the item is active */}
              {isActive && <ChevronRight size={18} className={styles.chevron} />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}