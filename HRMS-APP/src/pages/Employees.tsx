import { Search, SlidersHorizontal, SquarePen, Trash2, Eye } from 'lucide-react';
import styles from './Employees.module.css';

// TypeScript interface for our data structure
interface EmployeeData {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  department: string;
  status: 'Active' | 'On Leave' | 'In Active';
}

const DUMMY_EMPLOYEES: EmployeeData[] = [
  { id: 'EMP001', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1', designation: 'Sr.Back End Developer', department: 'Development', status: 'Active' },
  { id: 'EMP002', name: 'Sara John', avatar: 'https://i.pravatar.cc/150?u=2', designation: 'Sr.UI UX Designer', department: 'Design', status: 'Active' },
  { id: 'EMP003', name: 'Angel Philip', avatar: 'https://i.pravatar.cc/150?u=3', designation: 'Finance Manager', department: 'Finance', status: 'On Leave' },
  { id: 'EMP004', name: 'Anmariya', avatar: 'https://i.pravatar.cc/150?u=4', designation: 'Mern Stack Developer', department: 'Design', status: 'Active' },
  { id: 'EMP005', name: 'Augestien', avatar: 'https://i.pravatar.cc/150?u=5', designation: 'Sr.Graphics Designer', department: 'Design', status: 'In Active' },
  { id: 'EMP006', name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?u=6', designation: 'Marketing Manager', department: 'Marketing', status: 'Active' },
];

export default function Employees() {
  
  // Helper function to assign the correct CSS class based on status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return styles.statusActive;
      case 'On Leave': return styles.statusOnLeave;
      case 'In Active': return styles.statusInActive;
      default: return '';
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Employees</h1>

      <div className={styles.card}>
        
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchGroup}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input type="text" placeholder="Search" className={styles.searchInput} />
            </div>
            <button className={styles.filterBtn}>
              <SlidersHorizontal size={18} />
            </button>
          </div>
          
          <div className={styles.actionGroup}>
            <button className={styles.btnDark}>Add New</button>
            <button className={styles.btnGreen}>Export CSV</button>
          </div>
        </div>

        {/* Data Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_EMPLOYEES.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>
                    <div className={styles.employeeCell}>
                      <img src={emp.avatar} alt={emp.name} className={styles.avatar} />
                      <span className={styles.empName}>{emp.name}</span>
                    </div>
                  </td>
                  <td>{emp.designation}</td>
                  <td>{emp.department}</td>
                  <td>
                    <span className={`${styles.statusPill} ${getStatusClass(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button className={`${styles.actionIconBtn} ${styles.editBtn}`}>
                        <SquarePen size={14} />
                      </button>
                      <button className={`${styles.actionIconBtn} ${styles.deleteBtn}`}>
                        <Trash2 size={14} />
                      </button>
                      <button className={`${styles.actionIconBtn} ${styles.viewBtn}`}>
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button className={styles.pageBtn}>Previous</button>
          <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>Next</button>
        </div>

      </div>
    </div>
  );
}