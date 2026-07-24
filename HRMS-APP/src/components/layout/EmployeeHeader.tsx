// ---> NEW: Simplified header for the Employee Portal that does NOT call /employees/ API
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Mail, Bell, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import styles from './Header.module.css';

export default function EmployeeHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read the employee's own info from localStorage (set during login)
  const employeeName = localStorage.getItem('email') || 'Employee';
  const employeeRole = localStorage.getItem('role') || 'Employee';

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('username');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    sessionStorage.clear();
    navigate('/login');
  };

  // Build display name from email (strip @domain)
  const displayName = employeeName.includes('@')
    ? employeeName.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : employeeName;

  // Generate initials for the avatar circle
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.iconButton} aria-label="Open messages">
          <Mail size={20} />
        </button>
        <button type="button" className={styles.iconButton} aria-label="Open notifications">
          <Bell size={20} />
        </button>

        <div className={styles.profileContainer}>
          <div className={styles.profile}>
            <div className={styles.profileInfo}>
              <span className={styles.name}>{displayName}</span>
              <span className={styles.role}>{employeeRole}</span>
            </div>
            {/* Simple initials avatar instead of fetching from /employees/ API */}
            <div
              className={styles.avatar}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#60b3d1',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              {initials}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
