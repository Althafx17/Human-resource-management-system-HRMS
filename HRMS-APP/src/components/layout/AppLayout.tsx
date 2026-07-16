import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.contentArea}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}