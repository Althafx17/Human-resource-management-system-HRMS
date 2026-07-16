import React, { useState, useEffect } from 'react';
import { departmentApi } from '../../../apis/core/departmentApi';
import styles from './AddEmployee.module.css';

interface Step2Props {
  data: {
    department: string;
    designation: string;
    reportingManager: string;
    joiningDate: string;
    employmentType: string;
    isManager: boolean;
    managerRole: string;
  };
  updateData: (fields: Partial<Step2Props['data']>) => void;
}

export default function Step2JobDetails({ data, updateData }: Step2Props) {
  // ---> NEW: Department list and inline additions states
  const [departments, setDepartments] = useState<any[]>([]);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    departmentApi.getAll()
      .then(list => {
        setDepartments(list);
      })
      .catch(err => {
        console.error("Failed to load departments:", err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // ---> CHANGED: Trigger inline department creation mode if selected
    if (name === 'department' && value === 'ADD_NEW') {
      setIsAddingDepartment(true);
      return;
    }
    
    updateData({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateData({ [name]: checked });
  };

  // ---> NEW: Inline Department Creation Handlers
  const handleSaveDepartment = () => {
    if (!newDepartmentName.trim()) return;
    
    departmentApi.create({ name: newDepartmentName.trim() })
      .then(newDept => {
        setDepartments(prev => [...prev, newDept]);
        // Set newly created department as active value (using name or ID)
        updateData({ department: newDept.name });
        setIsAddingDepartment(false);
        setNewDepartmentName('');
      })
      .catch(err => {
        console.error("Failed to create department:", err);
        alert("Failed to create department. Please try again.");
      });
  };

  const handleCancelDepartment = () => {
    setIsAddingDepartment(false);
    setNewDepartmentName('');
    updateData({ department: '' });
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.stepTitle}>Step 2: Job Details</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="department">Department</label>
          {isAddingDepartment ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="New Dept Name"
                className={styles.inputField}
                style={{ flex: 1 }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveDepartment}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelDepartment}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#64748b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              id="department"
              name="department"
              value={data.department || ''}
              onChange={handleChange}
              className={styles.inputField}
              required
            >
              <option value="" disabled>Select Department</option>
              {departments.map((dept: any) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
              <option value="ADD_NEW">+ Add New Department</option>
            </select>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="designation">Designation</label>
          <select
            id="designation"
            name="designation"
            value={data.designation || ''}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="" disabled>Select Designation</option>
            <option value="Sr. Back End Developer">Sr. Back End Developer</option>
            <option value="Sr. UI UX Designer">Sr. UI UX Designer</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        {/* ---> NEW: Conditional Manager Role selection */}
        {data.designation === 'Manager' && (
          <div className={styles.inputGroup}>
            <label htmlFor="managerRole">Manager Role</label>
            <select
              id="managerRole"
              name="managerRole"
              value={data.managerRole || ''}
              onChange={handleChange}
              className={styles.inputField}
              required
            >
              <option value="" disabled>Select Manager Role</option>
              <option value="General Manager">General Manager</option>
              <option value="Assistant Manager">Assistant Manager</option>
              <option value="Department Manager">Department Manager</option>
              <option value="Branch Manager">Branch Manager</option>
            </select>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="reportingManager">Reporting Manager</label>
          <input
            id="reportingManager"
            type="text"
            name="reportingManager"
            value={data.reportingManager || ''}
            onChange={handleChange}
            placeholder="Sarah Connor"
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="joiningDate">Joining Date</label>
          <input
            id="joiningDate"
            type="date"
            name="joiningDate"
            value={data.joiningDate || ''}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="employmentType">Employment Type</label>
          <select
            id="employmentType"
            name="employmentType"
            value={data.employmentType || ''}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="" disabled>Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="isManager"
              checked={data.isManager || false}
              onChange={handleCheckboxChange}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxLabel}>Designate as Manager</span>
          </label>
        </div>
      </div>
    </div>
  );
}
