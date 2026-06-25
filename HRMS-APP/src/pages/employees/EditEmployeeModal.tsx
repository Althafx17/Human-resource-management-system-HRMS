import React, { useState } from 'react';
import { X } from 'lucide-react';
// We can reuse the exact same CSS module!
import styles from './AddEmployeeModal.module.css'; 
import type { EmployeeData } from './types';
import { employeeApi } from '../../services/employeeApi';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeData: EmployeeData | null;
  onSaveSuccess: (updatedEmployee: EmployeeData) => void;
}

type ModalTab = 'personal' | 'job' | 'payroll';

export default function EditEmployeeModal({ isOpen, onClose, employeeData, onSaveSuccess }: EditEmployeeModalProps) {
  const [prevEmployeeData, setPrevEmployeeData] = useState<EmployeeData | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>('personal');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    department: string;
    designation: string;
    status: EmployeeData['status'];
    phone: string;
    email: string;
    dob: string;
    address: string;
    joiningDate: string;
    reportingManager: string;
    workLocation: string;
    shift: string;
    basicSalary: string;
    paymentFrequency: string;
    bankName: string;
    accountNumber: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    skills: string;
  }>({
    name: '',
    department: '',
    designation: '',
    status: 'Active',
    phone: '',
    email: '',
    dob: '',
    address: '',
    joiningDate: '',
    reportingManager: '',
    workLocation: '',
    shift: '',
    basicSalary: '',
    paymentFrequency: '',
    bankName: '',
    accountNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    skills: ''
  });

  // Sync state with props during render when employeeData changes
  if (employeeData !== prevEmployeeData) {
    setPrevEmployeeData(employeeData);
    if (employeeData) {
      setFormData({
        name: employeeData.name || '',
        department: employeeData.department || '',
        designation: employeeData.designation || '',
        status: employeeData.status || 'Active',
        phone: employeeData.phone || '',
        email: employeeData.email || '',
        dob: employeeData.dob || '',
        address: employeeData.address || '',
        joiningDate: employeeData.joiningDate || '',
        reportingManager: employeeData.reportingManager || '',
        workLocation: employeeData.workLocation || '',
        shift: employeeData.shift || '',
        basicSalary: employeeData.basicSalary || '',
        paymentFrequency: employeeData.paymentFrequency || '',
        bankName: employeeData.bankName || '',
        accountNumber: employeeData.accountNumber || '',
        emergencyContactName: employeeData.emergencyContactName || '',
        emergencyContactPhone: employeeData.emergencyContactPhone || '',
        skills: employeeData.skills ? employeeData.skills.join(', ') : ''
      });
      setModalTab('personal'); // Reset modal tab to personal on load
    }
  }

  if (!isOpen || !employeeData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Process skills comma list back into array
    const skillsArray = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...employeeData,
      ...formData,
      skills: skillsArray
    };

    setIsSaving(true);
    employeeApi.update(employeeData.id, payload)
      .then((updatedEmployee) => {
        setIsSaving(false);
        onSaveSuccess(updatedEmployee);
        onClose();
      })
      .catch(err => {
        setIsSaving(false);
        console.error(err);
        alert('Failed to update employee: ' + (err.message || 'unknown error'));
      });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className={styles.header}>
          <h2>Edit Employee Profile</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button" title="Close modal" aria-label="Close modal"><X size={20} /></button>
        </div>

        {/* Modal Internal Navigation Tab Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eef2f6', padding: '0 24px', backgroundColor: '#fdfdfd' }}>
          <button 
            type="button" 
            style={{
              padding: '14px 16px',
              background: 'none',
              border: 'none',
              borderBottom: modalTab === 'personal' ? '2px solid #1a3646' : '2px solid transparent',
              color: modalTab === 'personal' ? '#1a3646' : '#64748b',
              fontWeight: modalTab === 'personal' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }} 
            onClick={() => setModalTab('personal')}
          >
            Personal Info
          </button>
          <button 
            type="button" 
            style={{
              padding: '14px 16px',
              background: 'none',
              border: 'none',
              borderBottom: modalTab === 'job' ? '2px solid #1a3646' : '2px solid transparent',
              color: modalTab === 'job' ? '#1a3646' : '#64748b',
              fontWeight: modalTab === 'job' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }} 
            onClick={() => setModalTab('job')}
          >
            Job Details
          </button>
          <button 
            type="button" 
            style={{
              padding: '14px 16px',
              background: 'none',
              border: 'none',
              borderBottom: modalTab === 'payroll' ? '2px solid #1a3646' : '2px solid transparent',
              color: modalTab === 'payroll' ? '#1a3646' : '#64748b',
              fontWeight: modalTab === 'payroll' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }} 
            onClick={() => setModalTab('payroll')}
          >
            Payroll & Bank
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body} style={{ minHeight: '340px' }}>
            {/* PERSONAL INFO TAB */}
            {modalTab === 'personal' && (
              <div>
                <div className={styles.avatarSection} style={{ marginBottom: '16px' }}>
                  <img src={employeeData.avatar} alt="Avatar" className={styles.avatarImage} style={{ width: '70px', height: '70px', border: '2px solid #1a3646' }} />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-name">Full Name</label>
                    <input id="edit-name" type="text" name="name" value={formData.name} onChange={handleChange} className={styles.inputField} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-phone">Phone</label>
                    <input id="edit-phone" type="text" name="phone" value={formData.phone} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-email">Email</label>
                    <input id="edit-email" type="email" name="email" value={formData.email} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-dob">Date of Birth</label>
                    <input id="edit-dob" type="date" name="dob" value={formData.dob} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="edit-address">Address</label>
                    <input id="edit-address" type="text" name="address" value={formData.address} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-emergency-name">Emergency Contact Name</label>
                    <input id="edit-emergency-name" type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-emergency-phone">Emergency Contact Phone</label>
                    <input id="edit-emergency-phone" type="text" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="edit-skills">Skills (comma-separated)</label>
                    <input id="edit-skills" type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, TypeScript, Figma" className={styles.inputField} />
                  </div>
                </div>
              </div>
            )}

            {/* JOB DETAILS TAB */}
            {modalTab === 'job' && (
              <div className={styles.formGrid}>
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
                    <option value="General">General</option>
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
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-joining">Joining Date</label>
                  <input id="edit-joining" type="text" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className={styles.inputField} placeholder="YYYY-MM-DD" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-manager">Reporting Manager</label>
                  <input id="edit-manager" type="text" name="reportingManager" value={formData.reportingManager} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-location">Work Location</label>
                  <input id="edit-location" type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="edit-shift">Shift</label>
                  <input id="edit-shift" type="text" name="shift" value={formData.shift} onChange={handleChange} className={styles.inputField} />
                </div>
              </div>
            )}

            {/* PAYROLL & BANK DETAILS TAB */}
            {modalTab === 'payroll' && (
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-salary">Basic Salary</label>
                  <input id="edit-salary" type="text" name="basicSalary" value={formData.basicSalary} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-frequency">Payment Frequency</label>
                  <input id="edit-frequency" type="text" name="paymentFrequency" value={formData.paymentFrequency} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-bank">Bank Name</label>
                  <input id="edit-bank" type="text" name="bankName" value={formData.bankName} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-account">Account Number</label>
                  <input id="edit-account" type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className={styles.inputField} />
                </div>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className={styles.btnSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}