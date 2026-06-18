import { Search, Mail, Bell, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
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
        
        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <span className={styles.name}>John Smith</span>
            <span className={styles.role}>HR Manager</span>
          </div>
          {/* Using a placeholder image for now */}
          <img 
            src="https://i.pravatar.cc/150?img=11" 
            alt="User Avatar" 
            className={styles.avatar}
          />
          <ChevronDown size={16} className={styles.chevron} />
        </div>
      </div>
    </header>
  );
}