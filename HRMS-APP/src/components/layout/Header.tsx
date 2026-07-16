import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Mail, Bell, ChevronDown, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { employeeApi } from '../../apis/core/employeeApi';
import type { EmployeeData } from '../../pages/employees/types';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---> NEW: Manager Profile Switcher states
  const [managers, setManagers] = useState<EmployeeData[]>([]);
  const [activeManager, setActiveManager] = useState<EmployeeData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ---> NEW: Auto-close dropdown when route location changes (tab switching)
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  // ---> NEW: Logout routine
  const handleLogout = () => {
    // Clear cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('username');

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');

    // Clear session storage
    sessionStorage.clear();

    // Redirect to login
    navigate('/login');
  };

  // ---> NEW: Fetch manager list from backend
  useEffect(() => {
    employeeApi.getManagers()
      .then(data => {
        // ---> CHANGED: Fallback frontend filter to guarantee only managers render in the UI
        const filteredManagers = data.filter(emp => 
          emp.designation === 'Manager' || 
          String(emp.designation).toLowerCase() === 'manager'
        );
        setManagers(filteredManagers);
        if (filteredManagers.length > 0) {
          setActiveManager(filteredManagers[0]);
        }
      })
      .catch(err => {
        console.error("Failed to load managers:", err);
      });
  }, []);

  const handleSelectManager = (manager: EmployeeData) => {
    setActiveManager(manager);
    setIsDropdownOpen(false);
  };

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
        
        {/* ---> CHANGED: Wrapper container for absolute positioning */}
        <div className={styles.profileContainer}>
          <div 
            className={styles.profile}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.profileInfo}>
              <span className={styles.name}>
                {activeManager ? activeManager.name : 'Manager'}
              </span>
              <span className={styles.role}>
                {activeManager ? activeManager.designation : 'HR Manager'}
              </span>
            </div>
            <img 
              src={activeManager && typeof activeManager.avatar === 'string' ? activeManager.avatar : 'https://i.pravatar.cc/150?img=11'} 
              alt={activeManager ? activeManager.name : 'User Avatar'} 
              className={styles.avatar}
            />
            <ChevronDown size={16} className={styles.chevron} />
          </div>

          {/* ---> NEW: Manager switcher dropdown list */}
          {isDropdownOpen && managers.length > 0 && (
            <div className={styles.dropdown}>
              {managers.map(manager => (
                <button
                  key={manager.id}
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => handleSelectManager(manager)}
                >
                  <img
                    src={typeof manager.avatar === 'string' ? manager.avatar : 'https://i.pravatar.cc/150?img=11'}
                    alt={manager.name}
                    className={styles.dropdownAvatar}
                  />
                  <div className={styles.dropdownInfo}>
                    <span className={styles.dropdownName}>{manager.name}</span>
                    <span className={styles.dropdownRole}>{manager.designation}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---> NEW: Logout button */}
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