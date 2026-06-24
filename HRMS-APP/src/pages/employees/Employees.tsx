import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SquarePen, Trash2, Eye } from 'lucide-react';
import styles from './Employees.module.css';
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";
import type { EmployeeData } from './data';

const INITIAL_EMPLOYEES: EmployeeData[] = [
  {
    id: 'EMP001',
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?u=1',
    designation: 'Sr.Back End Developer',
    department: 'Engineering',
    status: 'Active',
    phone: '+1 234 567 890',
    email: 'john.smith@company.com',
    dob: '1990-05-15',
    address: '123 Tech Street, CA',
    joiningDate: '2022-01-10',
    reportingManager: 'Sarah Connor',
    workLocation: 'San Francisco (Hybrid)',
    shift: 'Standard (9:00 AM - 5:00 PM)',
    basicSalary: '$95,000 / Year',
    paymentFrequency: 'Bi-Weekly',
    bankName: 'Chase Bank',
    accountNumber: '**** **** 4321',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1 234 567 891',
    skills: ['REACT', 'TYPESCRIPT', 'NODEJS', 'PYTHON']
  },
  {
    id: 'EMP002',
    name: 'Sara John',
    avatar: 'https://i.pravatar.cc/150?u=2',
    designation: 'Sr.UI UX Designer',
    department: 'Design',
    status: 'Active',
    phone: '+1 234 567 892',
    email: 'sara.john@company.com',
    dob: '1992-08-20',
    address: '456 Art Ave, SF',
    joiningDate: '2023-03-15',
    reportingManager: 'Sarah Connor',
    workLocation: 'San Francisco (Hybrid)',
    shift: 'Standard (9:00 AM - 5:00 PM)',
    basicSalary: '$90,000 / Year',
    paymentFrequency: 'Bi-Weekly',
    bankName: 'Wells Fargo',
    accountNumber: '**** **** 8765',
    emergencyContactName: 'Robert John',
    emergencyContactPhone: '+1 234 567 893',
    skills: ['FIGMA', 'UI/UX', 'ILLUSTRATOR', 'PHOTOSHOP']
  }
];

export default function Employees() {
  // 1. Convert the static list into interactive React State
  const [employees, setEmployees] = useState<EmployeeData[]>(INITIAL_EMPLOYEES);
  
  // 2. Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeData | null>(null);

  // --- ACTIONS ---

  // Handle Deleting an employee
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  // Handle Opening the Edit Modal
  const openEditModal = (emp: EmployeeData) => {
    setEmployeeToEdit(emp);
    setIsEditModalOpen(true);
  };

  // Handle Adding a new employee from the Add Modal
  const handleAddEmployee = (newEmp: EmployeeData) => {
    setEmployees([newEmp, ...employees]); // Adds to top of list
  };

  // Handle Saving changes from the Edit Modal
  const handleSaveEdit = (updatedEmp: EmployeeData) => {
    setEmployees(employees.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
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
            <button type="button" className={styles.btnDark} onClick={() => setIsAddModalOpen(true)} title="Add new employee" aria-label="Add new employee">
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
      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employeeData={employeeToEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}