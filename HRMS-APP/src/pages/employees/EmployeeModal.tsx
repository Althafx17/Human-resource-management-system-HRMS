// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import styles from './EmployeeModal.module.css'; 
import type { EmployeeData } from './types';
import { employeeApi } from '../../services/employeeApi';
import { useToast } from '../../components/ToastContext';

// ==========================================
// 2. TYPES & INTERFACES
// ==========================================

/**
 * Props for the unified EmployeeModal component.
 */
interface EmployeeModalProps {
  /** Controls visibility of the modal card. */
  isOpen: boolean;
  /** Triggered when the user clicks cancel, close, or background backdrop. */
  onClose: () => void;
  /** Existing employee profile data to edit, or null if creating a new employee. */
  employeeData: EmployeeData | null;
  /** Callback triggered when the employee record is successfully created or updated in the backend. */
  onSaveSuccess: (savedEmployee: EmployeeData) => void;
}

/** Available navigation tabs in the modal form. */
type ModalTab = 'personal' | 'job' | 'payroll';

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

/**
 * EmployeeModal Component
 * 
 * A tabbed popup modal container handling both creation (Add) and updates (Edit) of employee records.
 * Integrates directly with the `employeeApi` and manages three sub-forms: Personal Info, Job Details, and Payroll.
 */
export default function EmployeeModal({ isOpen, onClose, employeeData, onSaveSuccess }: EmployeeModalProps) {
  const { showToast } = useToast();
  
  // Track previous prop data to detect prop changes and sync React state
  const [prevEmployeeData, setPrevEmployeeData] = useState<EmployeeData | null>(null);
  
  // Active navigation tab
  const [modalTab, setModalTab] = useState<ModalTab>('personal');
  
  // Submit loading state
  const [isSaving, setIsSaving] = useState(false);
  
  // Explicit states to handle profile photo upload files and preview URLs
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // File input ref for avatar image upload trigger
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ---> NEW: Local managers candidates state lookup
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);

  // Fetch managers candidates from the employee lists
  React.useEffect(() => {
    employeeApi.getAll()
      .then(res => {
        const list = res.results || [];
        const managersFromEmployees = list
          .filter(emp => {
            const des = String(emp.designation || '').toLowerCase();
            return des.includes('manager') || des.includes('lead') || des.includes('director') || des.includes('head') || des.includes('vp') || des.includes('chief');
          })
          .map(emp => ({ id: String(emp.id), name: emp.name }));
        setManagers(managersFromEmployees);
      })
      .catch(err => {
        console.error('Failed to load managers:', err);
      });
  }, []);

  // Filter available managers list
  const getAvailableManagers = () => {
    const defaultManagers = [
      { id: '2', name: 'Sarah Connor' },
      { id: '3', name: 'Sarah John' },
      { id: '4', name: 'John Smith' }
    ];
    const activeManagers = managers.filter(m => m.id !== String(employeeData?.id));
    const merged = [...activeManagers, ...defaultManagers];
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    merged.forEach(m => {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    });
    return result;
  };

  // Convert legacy names or match select values
  const getSelectValue = () => {
    const val = formData.reportingManager;
    if (!val) return '';
    if (!isNaN(Number(val)) && String(val).trim() !== '') return String(val);
    
    const mgrs = getAvailableManagers();
    const found = mgrs.find(m => m.name.toLowerCase() === val.toLowerCase());
    return found ? found.id : '';
  };

  /**
   * File selection change handler generating local preview URL objects.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Form states mapping directly to backend properties
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
    avatar: string | File;
  }>({
    name: '',
    department: 'Engineering',
    designation: 'Full Stack Developer',
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
    paymentFrequency: 'Monthly',
    bankName: '',
    accountNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    skills: '',
    avatar: ''
  });

  // Sync state values with props when selected employeeData changes
  if (employeeData !== prevEmployeeData) {
    setPrevEmployeeData(employeeData);
    if (employeeData) {
      // Pre-fill state values for Edit Mode
      setFormData({
        name: employeeData.name || '',
        department: employeeData.department || 'Engineering',
        designation: employeeData.designation || 'Full Stack Developer',
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
        paymentFrequency: employeeData.paymentFrequency || 'Monthly',
        bankName: employeeData.bankName || '',
        accountNumber: employeeData.accountNumber || '',
        emergencyContactName: employeeData.emergencyContactName || '',
        emergencyContactPhone: employeeData.emergencyContactPhone || '',
        skills: employeeData.skills ? employeeData.skills.join(', ') : '',
        avatar: employeeData.avatar || ''
      });
      setAvatarFile(null);
      setPreviewUrl(typeof employeeData.avatar === 'string' ? employeeData.avatar : '');
      // Reset navigation tab to first tab on profile load
      setModalTab('personal');
    } else {
      // Clear form properties for Add Mode
      setFormData({
        name: '',
        department: 'Engineering',
        designation: 'Full Stack Developer',
        status: 'Active',
        phone: '',
        email: '',
        dob: '',
        address: '',
        // Automatically default joining date to today's local date
        joiningDate: new Date().toISOString().split('T')[0],
        reportingManager: '',
        workLocation: '',
        shift: '',
        basicSalary: '',
        paymentFrequency: 'Monthly',
        bankName: '',
        accountNumber: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        skills: '',
        avatar: ''
      });
      setAvatarFile(null);
      setPreviewUrl('');
      setModalTab('personal');
    }
  }

  // Do not render anything if modal is closed
  if (!isOpen) return null;

  /**
   * Generic text/select input change handler updating form state dynamically.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Submits form payload to the backend REST API.
   * Performs validation, formats comma-separated skills into arrays, and determines POST/PUT API action.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Required name check
    if (!formData.name.trim()) {
      showToast('Employee name is required', 'error');
      return;
    }

    // Split skills string back into an array for API compatibility
    const skillsArray = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...(employeeData || {}),
      ...formData,
      skills: skillsArray,
      avatar: avatarFile || formData.avatar
    };

    setIsSaving(true);
    const isEditMode = !!employeeData;
    const apiCall = isEditMode
      ? employeeApi.update(employeeData.id, payload)
      : employeeApi.create(payload);

    apiCall
      .then((savedEmployee) => {
        setIsSaving(false);
        onSaveSuccess(savedEmployee);
        onClose();
      })
      .catch(error => {
        setIsSaving(false);
        console.error("Save Error:", error.response?.data || error.message);
        showToast(isEditMode ? 'Failed to update employee details' : 'Failed to create employee', 'error');
      });
  };

  const isEditMode = !!employeeData;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditMode ? 'Edit Employee Profile' : 'Add New Employee'}</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button" title="Close modal" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Internal Navigation Tab Bar */}
        <div className={styles.tabsContainer}>
          <button 
            type="button" 
            className={`${styles.tab} ${modalTab === 'personal' ? styles.activeTab : ''}`}
            onClick={() => setModalTab('personal')}
          >
            Personal Info
          </button>
          <button 
            type="button" 
            className={`${styles.tab} ${modalTab === 'job' ? styles.activeTab : ''}`}
            onClick={() => setModalTab('job')}
          >
            Job Details
          </button>
          <button 
            type="button" 
            className={`${styles.tab} ${modalTab === 'payroll' ? styles.activeTab : ''}`}
            onClick={() => setModalTab('payroll')}
          >
            Payroll & Bank
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {/* PERSONAL INFO TAB */}
            {modalTab === 'personal' && (
              <div>
                <div className={styles.avatarSection}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div 
                    style={{ cursor: 'pointer', position: 'relative', width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #1a3646', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Change Photo"
                  >
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Avatar Preview" 
                        className={styles.avatarImage} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <User size={32} color="#64748b" />
                    )}
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-name">Full Name *</label>
                    <input id="edit-name" type="text" name="name" value={formData.name} onChange={handleChange} className={styles.inputField} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-phone">Phone</label>
                    <input id="edit-phone" type="text" name="phone" value={formData.phone} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-email">Email *</label>
                    <input id="edit-email" type="email" name="email" value={formData.email} onChange={handleChange} className={styles.inputField} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="edit-dob">Date of Birth</label>
                    <input id="edit-dob" type="date" name="dob" value={formData.dob} onChange={handleChange} className={styles.inputField} />
                  </div>
                  <div className={`${styles.inputGroup} ${styles.spanFull}`}>
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
                  <div className={`${styles.inputGroup} ${styles.spanFull}`}>
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
                  <label htmlFor="edit-designation">Designation *</label>
                  <input id="edit-designation" type="text" name="designation" value={formData.designation} onChange={handleChange} className={styles.inputField} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-department">Department *</label>
                  <select id="edit-department" name="department" value={formData.department} onChange={handleChange} className={styles.inputField} required>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-status">Status *</label>
                  <select id="edit-status" name="status" value={formData.status} onChange={handleChange} className={styles.inputField} required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-joiningDate">Joining Date *</label>
                  <input id="edit-joiningDate" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className={styles.inputField} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-reportingManager">Reporting Manager</label>
                  <select
                    id="edit-reportingManager"
                    name="reportingManager"
                    value={getSelectValue()}
                    onChange={handleChange}
                    className={styles.inputField}
                  >
                    <option value="">No Manager</option>
                    {getAvailableManagers().map((mgr) => (
                      <option key={mgr.id} value={mgr.id}>
                        {mgr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-workLocation">Work Location</label>
                  <input id="edit-workLocation" type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-shift">Shift</label>
                  <input id="edit-shift" type="text" name="shift" value={formData.shift} onChange={handleChange} className={styles.inputField} />
                </div>
              </div>
            )}

            {/* PAYROLL TAB */}
            {modalTab === 'payroll' && (
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-basicSalary">Basic Salary (USD) *</label>
                  <input id="edit-basicSalary" type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} className={styles.inputField} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-paymentFrequency">Payment Frequency *</label>
                  <select id="edit-paymentFrequency" name="paymentFrequency" value={formData.paymentFrequency} onChange={handleChange} className={styles.inputField} required>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-bankName">Bank Name</label>
                  <input id="edit-bankName" type="text" name="bankName" value={formData.bankName} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-accountNumber">Account Number</label>
                  <input id="edit-accountNumber" type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className={styles.inputField} />
                </div>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button 
              type="button" 
              className={styles.btnCancel} 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.btnSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
