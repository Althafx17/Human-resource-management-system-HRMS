import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import styles from './AddEmployeeModal.module.css';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // We add this prop so the main page can update its list
  onAdd: (newEmployee: any) => void; 
}

export default function AddEmployeeModal({ isOpen, onClose, onAdd }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    joiningDate: '',
    email: '',
    phone: '',
    department: 'Engineering' // Added Department
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new employee object mimicking your table data structure
    const newEmp = {
      id: formData.employeeId,
      name: `${formData.firstName} ${formData.lastName}`,
      avatar: 'https://i.pravatar.cc/150?u=new', // Placeholder avatar
      designation: 'New Employee', // Placeholder
      department: formData.department,
      status: 'Active' as const,
    };

    onAdd(newEmp);
    onClose();
    
    // Reset form
    setFormData({ firstName: '', lastName: '', employeeId: '', joiningDate: '', email: '', phone: '', department: 'Engineering' });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add New Employee</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button" title="Close modal" aria-label="Close modal"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {/* Avatar Section... */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarCircle}><User size={40} /></div>
              <span className={styles.avatarLabel}>Employee Thumbnail</span>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={styles.inputField} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={styles.inputField} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="employeeId">Employee ID</label>
                <input id="employeeId" type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className={styles.inputField} required />
              </div>
              
              {/* NEW DEPARTMENT DROPDOWN */}
              <div className={styles.inputGroup}>
                <label htmlFor="department">Department</label>
                <select id="department" name="department" value={formData.department} onChange={handleChange} className={styles.inputField} required>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className={styles.inputField} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.inputField} required />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}