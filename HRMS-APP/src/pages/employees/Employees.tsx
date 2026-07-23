import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SquarePen, Trash2, Eye } from 'lucide-react';
import styles from './Employees.module.css';
import EmployeeModal from "./EmployeeModal";
import type { EmployeeData } from './types';
import { employeeApi } from '../../apis/core/employeeApi';
import { useToast } from '../../contexts/ToastContext';
import { useAuthRole } from '../../contexts/AuthRoleContext';

export default function Employees() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { role } = useAuthRole();
  const isEmployee = role === 'employee';

  // Convert the dynamic list into interactive React State fetched from API
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapped Lookups
  const [departments, setDepartments] = useState<Record<number, string>>({});
  const [designations, setDesignations] = useState<Record<number, string>>({});

  // Pagination & Filtering States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // Navigation states parsed from standard Django REST Framework next/previous keys
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeData | null>(null);

  // Fetch lookups on mount
  useEffect(() => {
    employeeApi.getDepartments().then(list => {
      const map: Record<number, string> = {};
      list.forEach(d => { map[d.id] = d.name; });
      setDepartments(map);
    });
    employeeApi.getDesignations().then(list => {
      const map: Record<number, string> = {};
      list.forEach(d => { map[d.id] = d.title; });
      setDesignations(map);
    });
  }, []);

  /**
   * Performs the API call to load a specific page of employees.
   * Leverages the next/previous page keys from the backend response.
   */
  const loadEmployees = (page = 1) => {
    setIsLoading(true);
    employeeApi.getAll(page, searchTerm, departmentFilter)
      .then(data => {
        console.log("API Response:", data);
        
        // ---> CHANGED: Safely extract employee list from paginated or non-paginated backend response
        const employeeList = (data as any).results ? (data as any).results : (Array.isArray(data) ? data : []);
        setEmployees(employeeList);
        
        setHasNext(!!(data as any).next);
        setHasPrev(!!(data as any).previous);
        
        // Compute total pages based on count fallback (assumes page size 10)
        const count = (data as any).count !== undefined ? (data as any).count : (Array.isArray(data) ? data.length : 0);
        const total = Math.ceil(count / 10);
        setTotalPages(total > 0 ? total : 1);
        
        setError(null);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch employees. Please check your API configuration.');
        setIsLoading(false);
      });
  };

  // Re-fetch employee list whenever page, search query, or department filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadEmployees(currentPage);
    }, searchTerm ? 400 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, departmentFilter]);

  // --- ACTIONS ---

  // Handle Deleting an employee
  const handleDelete = (id: string) => {
    if (!id) { console.error("Delete failed: ID is undefined"); return; }
    if (window.confirm("Are you sure you want to delete this employee?")) {
      employeeApi.delete(id)
        .then(() => {
          loadEmployees(currentPage);
          showToast('Employee deleted successfully!', 'success');
        })
        .catch(error => {
          console.error("Delete Error:", error.response?.data || error.message);
          showToast('Failed to delete employee', 'error');
        });
    }
  };

  // Handle Opening the Edit Modal
  const openEditModal = (emp: EmployeeData) => {
    setEmployeeToEdit(emp);
    setIsEditModalOpen(true);
  };

  // Handle Saving changes from the Edit Modal
  const handleSaveEdit = (updatedEmp: EmployeeData) => {
    loadEmployees(currentPage);
    showToast('Employee profile updated successfully!', 'success');
  };

  // CSS helper
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return styles.statusActive;
      case 'On Leave': return styles.statusOnLeave;
      case 'Inactive':
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
              <input 
                type="text" 
                placeholder="Search by name..." 
                className={styles.searchInput} 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                  setIsLoading(true);
                }}
              />
            </div>
            
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
                setIsLoading(true);
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                fontSize: '14px',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="General">General</option>
            </select>
          </div>
          
          <div className={styles.actionGroup}>
            {!isEmployee && (
              <button type="button" className={styles.btnDark} onClick={() => navigate('/employees/add')} title="Add new employee" aria-label="Add new employee">
                Add New
              </button>
            )}
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
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td><div className={styles.skeleton} style={{ width: '40px', height: '16px' }}></div></td>
                    <td>
                      <div className={styles.employeeCell}>
                        <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: '32px', height: '32px' }}></div>
                        <div className={styles.skeleton} style={{ width: '120px', height: '16px' }}></div>
                      </div>
                    </td>
                    <td><div className={styles.skeleton} style={{ width: '100px', height: '16px' }}></div></td>
                    <td><div className={styles.skeleton} style={{ width: '80px', height: '16px' }}></div></td>
                    <td><div className={styles.skeleton} style={{ width: '60px', height: '24px', borderRadius: '12px' }}></div></td>
                    <td><div className={styles.skeleton} style={{ width: '90px', height: '28px' }}></div></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    {error}
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>
                      <div className={styles.employeeCell}>
                        <img src={emp.avatar} alt={emp.name} className={styles.avatar} />
                        <span className={styles.empName}>{emp.name}</span>
                      </div>
                    </td>
                    <td>{designations[Number(emp.designation)] || emp.designation}</td>
                    <td>{departments[Number(emp.department)] || emp.department}</td>
                    <td>
                      <span className={`${styles.statusPill} ${getStatusClass(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        {/* EDIT BUTTON */}
                        {!isEmployee && (
                          <button 
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.editBtn}`}
                            onClick={() => openEditModal(emp)}
                            title={`Edit ${emp.name}`}
                            aria-label={`Edit ${emp.name}`}
                          >
                            <SquarePen size={14} />
                          </button>
                        )}
                        
                        {/* DELETE BUTTON */}
                        {!isEmployee && (
                          <button 
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.deleteBtn}`}
                            onClick={() => handleDelete(emp.id)}
                            title={`Delete ${emp.name}`}
                            aria-label={`Delete ${emp.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        
                        {/* VIEW BUTTON (Wrapped in Link to navigate to profile) */}
                        <Link to={`/employees/${emp.id}`} className={`${styles.actionIconBtn} ${styles.viewBtn}`} title={`View ${emp.name}`} aria-label={`View ${emp.name}`}>
                          <Eye size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button 
            type="button" 
            className={styles.pageBtn}
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              setIsLoading(true);
            }}
            disabled={!hasPrev || isLoading}
          >
            &lt; Previous
          </button>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            type="button" 
            className={styles.pageBtn}
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              setIsLoading(true);
            }}
            disabled={!hasNext || isLoading}
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* Render Modals */}
      <EmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEmployeeToEdit(null);
        }}
        employeeData={employeeToEdit}
        onSaveSuccess={handleSaveEdit}
      />
    </div>
  );
}