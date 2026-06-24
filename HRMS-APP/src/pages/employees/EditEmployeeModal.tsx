import React, { useState } from 'react';
import { X } from 'lucide-react';
// We can reuse the exact same CSS module!
import styles from './AddEmployeeModal.module.css'; 
import type { EmployeeData } from './data';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeData: EmployeeData | null;
  onSave: (updatedEmployee: EmployeeData) => void;
}

export default function EditEmployeeModal({ isOpen, onClose, employeeData, onSave }: EditEmployeeModalProps) {
  const [prevEmployeeData, setPrevEmployeeData] = useState<EmployeeData | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    department: string;
    designation: string;
    status: EmployeeData['status'];
  }>({
    name: '',
    department: '',
    designation: '',
    status: 'Active'
  });

  // Sync state with props during render when employeeData changes
  if (employeeData !== prevEmployeeData) {
    setPrevEmployeeData(employeeData);
    if (employeeData) {
      setFormData({
        name: employeeData.name,
        department: employeeData.department,
        designation: employeeData.designation,
        status: employeeData.status
      });
    }
  }

  if (!isOpen || !employeeData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...employeeData, ...formData });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit Employee</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button" title="Close modal" aria-label="Close modal"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.avatarSection}>
              <img src={employeeData.avatar} alt="Avatar" className={styles.avatarImage} />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="edit-name">Full Name</label>
                <input id="edit-name" type="text" name="name" value={formData.name} onChange={handleChange} className={styles.inputField} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="edit-designation">Designation</label>
                <input id="edit-designation" type="text" name="designation" value={formData.designation} onChange={handleChange} className={styles.inputField} required />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="edit-department">Department</label>
                <select id="edit-department" name="department" value={formData.department} onChange={handleChange} className={styles.inputField} required>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="edit-status">Status</label>
                <select id="edit-status" name="status" value={formData.status} onChange={handleChange} className={styles.inputField} required>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="In Active">In Active</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}