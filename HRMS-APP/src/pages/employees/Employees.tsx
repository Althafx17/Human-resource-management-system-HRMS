import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SquarePen, Trash2, Eye } from 'lucide-react';
import styles from './Employees.module.css';
import EditEmployeeModal from "./EditEmployeeModal";
import type { EmployeeData } from './data';
import { employeeData } from './data';

export default function Employees() {
  const navigate = useNavigate();
  // 1. Convert the dynamic shared list into interactive React State
  const [employees, setEmployees] = useState<EmployeeData[]>(employeeData);
  
  // 2. Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeData | null>(null);

  // --- ACTIONS ---

  // Handle Deleting an employee
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const idx = employeeData.findIndex(emp => emp.id === id);
      if (idx !== -1) {
        employeeData.splice(idx, 1);
      }
      setEmployees([...employeeData]);
    }
  };

  // Handle Opening the Edit Modal
  const openEditModal = (emp: EmployeeData) => {
    setEmployeeToEdit(emp);
    setIsEditModalOpen(true);
  };

  // Handle Saving changes from the Edit Modal
  const handleSaveEdit = (updatedEmp: EmployeeData) => {
    const idx = employeeData.findIndex(emp => emp.id === updatedEmp.id);
    if (idx !== -1) {
      employeeData[idx] = updatedEmp;
    }
    setEmployees([...employeeData]);
  };

  // CSS helper
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
        <div className={styles.toolbar}>
          <div className={styles.searchGroup}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input type="text" placeholder="Search" className={styles.searchInput} />
            </div>
          </div>
          
          <div className={styles.actionGroup}>
            <button type="button" className={styles.btnDark} onClick={() => navigate('/employees/add')} title="Add new employee" aria-label="Add new employee">
              Add New
            </button>
            <button type="button" className={styles.btnGreen} title="Export CSV" aria-label="Export CSV">Export CSV</button>
          </div>
        </div>

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
              {/* Map over the STATE, not the static array */}
              {employees.map((emp) => (
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
                      {/* EDIT BUTTON */}
                      <button 
                        type="button"
                        className={`${styles.actionIconBtn} ${styles.editBtn}`}
                        onClick={() => openEditModal(emp)}
                        title={`Edit ${emp.name}`}
                        aria-label={`Edit ${emp.name}`}
                      >
                        <SquarePen size={14} />
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        type="button"
                        className={`${styles.actionIconBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(emp.id)}
                        title={`Delete ${emp.name}`}
                        aria-label={`Delete ${emp.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      {/* VIEW BUTTON (Wrapped in Link to navigate to profile) */}
                      <Link to={`/employees/${emp.id}`} className={`${styles.actionIconBtn} ${styles.viewBtn}`} title={`View ${emp.name}`} aria-label={`View ${emp.name}`}>
                        <Eye size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modals */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employeeData={employeeToEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}