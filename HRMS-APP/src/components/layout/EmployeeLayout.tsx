// ---> NEW:
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

export default function EmployeeLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.appContainer}>
      <EmployeeSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.contentArea}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
