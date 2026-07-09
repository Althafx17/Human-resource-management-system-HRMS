// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, Edit, Download, 
  Eye, Briefcase, DollarSign, FileText, ShieldCheck 
} from 'lucide-react';
import styles from './EmployeeDetails.module.css';

import OverviewTab from './tab/OverviewTab';
import JobDetailsTab from './tab/JobDetailsTab';
import PayrollTab from './tab/PayrollTab';
import ContractTab from './tab/ContractTab';
import DocumentsTab from './tab/DocumentsTab';
import type { EmployeeData } from '../types';
import { employeeApi } from '../../../services/employeeApi';
import { useToast } from '../../../components/ToastContext';
import { EmployeeProvider, useEmployeeContext } from './EmployeeContext';

// ==========================================
// 2. CONSTANTS & TYPES
// ==========================================

/** Tab configurations for view switching */
const TABS = [
  { id: 'OVERVIEW', label: 'OVERVIEW', icon: Eye },
  { id: 'JOB_DETAILS', label: 'JOB DETAILS', icon: Briefcase },
  { id: 'PAYROLL', label: 'PAYROLL', icon: DollarSign },
  { id: 'CONTRACT', label: 'CONTRACT', icon: FileText },
  { id: 'DOCUMENTS', label: 'DOCUMENTS', icon: ShieldCheck },
];

// ==========================================
// 3. MAIN COMPONENT CONTENT
// ==========================================

/**
 * EmployeeDetailsContent Component
 * 
 * Renders the internal layout of the employee profile screen, consuming state from EmployeeContext.
 * Coordinates profile inline editing and handles lookups mapping.
 */
function EmployeeDetailsContent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  
  // Consume shared state from context
  const { employee, isLoading, error, setEmployee } = useEmployeeContext();
  
  // Editing state controls
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<EmployeeData | null>(null);

  // ---> CHANGED: Mapped primary key lookups containing ID and name pairs
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<Record<number, string>>({});
  const [designations, setDesignations] = useState<Record<number, string>>({});

  // Reset local edit states if URL ID parameter changes
  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setIsEditing(false);
    setEditFormData(null);
  }

  // Fetch departments and designations lookups on component mount
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

  // ---> NEW: Fetch managers candidates from the employee lists, mapping both ID and name
  useEffect(() => {
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

  /**
   * Updates state during inline editing changes inside subtabs.
   */
  const handleTabFormChange = (fields: Partial<EmployeeData>) => {
    setEditFormData(prev => prev ? { ...prev, ...fields } : null);
  };

  /**
   * Helper mapping tabs to their sub-views.
   */
  const renderTabContent = () => {
    if (!employee) return null;
    const currentData = isEditing && editFormData ? editFormData : employee;
    const displayEmployee = {
      ...currentData,
      department: departments[Number(currentData.department)] || currentData.department,
      designation: designations[Number(currentData.designation)] || currentData.designation,
    };
    switch (activeTab) {
      case 'OVERVIEW': return <OverviewTab isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} onSave={handleSaveEdit} onCancel={handleCancelEdit} />;
      case 'JOB_DETAILS': return <JobDetailsTab employee={displayEmployee} isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} managers={getAvailableManagers()} />;
      case 'PAYROLL': return <PayrollTab employee={displayEmployee} isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} />;
      case 'CONTRACT': return <ContractTab employee={displayEmployee} isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} />;
      case 'DOCUMENTS': return <DocumentsTab employee={displayEmployee} isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} />;
      default: return <OverviewTab employee={displayEmployee} isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} onSave={handleSaveEdit} onCancel={handleCancelEdit} />;
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditFormData(employee);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  /**
   * Submits edited profile details back to the backend.
   * On success, syncs the updated employee model globally in the Context.
   */
  const handleSaveEdit = () => {
    if (!editFormData || !id) return;

    if (!editFormData.name || !editFormData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    employeeApi.update(id, editFormData)
      .then((updated) => {
        setEmployee(updated);
        setIsEditing(false);
        setEditFormData(null);
        showToast('Employee profile updated successfully!', 'success');
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to update employee details', 'error');
      });
  };

  /**
   * ---> CHANGED: Filters candidate list of managers to exclude the employee themselves and maps to ID/name objects.
   */
  const getAvailableManagers = () => {
    // Default managers with fallback mock IDs
    const defaultManagers = [
      { id: '2', name: 'Sarah Connor' },
      { id: '3', name: 'Sarah John' },
      { id: '4', name: 'John Smith' }
    ];

    // Filter dynamic managers from employee list
    const dynamicManagers = managers.filter(m => m.id !== String(employee?.id));

    // Combine and deduplicate by ID
    const merged = [...dynamicManagers, ...defaultManagers];
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];

    merged.forEach(m => {
      if (!seen.has(m.id) && m.id !== String(employee?.id)) {
        seen.add(m.id);
        result.push(m);
      }
    });

    return result;
  };

  /**
   * ---> NEW: Resolves selected dropdown value supporting backward compatibility for text name records.
   */
  const getSelectValue = () => {
    const val = employee?.reportingManager;
    if (!val) return '';
    if (!isNaN(Number(val)) && String(val).trim() !== '') return String(val);
    
    // It is a name string, find matching manager's ID
    const mgrs = getAvailableManagers();
    const found = mgrs.find(m => m.name.toLowerCase() === val.toLowerCase());
    return found ? found.id : '';
  };

  /**
   * ---> CHANGED: Directly updates the employee manager relation by ID.
   */
  const handleManagerChange = (managerId: string) => {
    if (!employee || !id) return;
    
    // ---> CHANGED: Pass managerId value to update reporting manager relation
    employeeApi.update(id, { reportingManager: managerId })
      .then((updated) => {
        setEmployee(updated);
        showToast('Reporting manager updated successfully!', 'success');
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to update reporting manager', 'error');
      });
  };

  // Render skeleton screens if the context is loading
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.headerWrapper}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={`${styles.skeleton} ${styles.skeletonAvatar}`}></div>
              <div className={`${styles.details} ${styles.detailsSkeletonWrapper}`}>
                <div className={`${styles.skeleton} ${styles.titleSkeleton}`}></div>
                <div className={`${styles.skeleton} ${styles.subtitleSkeleton}`}></div>
                <div className={`${styles.skeleton} ${styles.textSkeleton}`}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardSkeleton}`}>
          <div className={`${styles.skeleton} ${styles.cardSkeletonTitle}`}></div>
          <div className={`${styles.skeleton} ${styles.cardSkeletonBody}`}></div>
        </div>
      </div>
    );
  }

  if (error) return <div className={styles.errorWrapper}>{error}</div>;
  if (!employee) return <div className={styles.notFoundWrapper}>Employee profile not found.</div>;

  return (
    <div className={styles.page}>
      
      <div className={styles.headerWrapper}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} type="button" aria-label="Go Back" title="Go Back">
          <ArrowLeft size={20} />
        </button>

        <div className={styles.profileHeader}>
          <div className={`${styles.profileInfo} ${styles.profileInfoFull}`}>
            <div 
              className={`${styles.avatarPlaceholder} ${isEditing ? styles.editableAvatar : ''}`}
              onClick={() => isEditing && avatarInputRef.current?.click()}
              title={isEditing ? "Click to change photo" : undefined}
            >
              <input
                type="file"
                ref={avatarInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleTabFormChange({ avatar: file });
                  }
                }}
                accept="image/*"
                className={styles.hiddenFileInput}
                title="Upload employee profile image"
                aria-label="Upload employee profile image"
              />
              <img 
                src={
                  editFormData?.avatar instanceof File 
                    ? URL.createObjectURL(editFormData.avatar) 
                    : (editFormData?.avatar || employee.avatar)
                } 
                alt="Avatar" 
                className={styles.avatarImage} 
              />
              {isEditing && (
                <div className={styles.avatarOverlay}>
                  Change
                </div>
              )}
            </div>
            <div className={styles.details}>
              {isEditing ? (
                <div className={styles.editFormContainer}>
                  <div className={styles.editFormRow}>
                    <div className={styles.editFormCol}>
                      <label htmlFor="fullNameInput" className={styles.editLabel}>Full Name</label>
                      <input 
                        id="fullNameInput"
                        type="text" 
                        name="name" 
                        value={editFormData?.name || ''} 
                        onChange={(e) => handleTabFormChange({ name: e.target.value })} 
                        className={styles.inlineInput} 
                      />
                    </div>
                    <div className={styles.editFormColStatus}>
                      <label htmlFor="statusSelect" className={styles.editLabel}>Status</label>
                      <select 
                        id="statusSelect"
                        name="status" 
                        value={editFormData?.status || ''} 
                        onChange={(e) => handleTabFormChange({ status: e.target.value as any })} 
                        className={styles.inlineInput}
                        title="Employee status"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.editFormRow}>
                    <div className={styles.editFormCol}>
                      <label htmlFor="designationSelect" className={styles.editLabel}>Designation</label>
                      <select 
                        id="designationSelect"
                        name="designation" 
                        value={editFormData?.designation || ''} 
                        onChange={(e) => handleTabFormChange({ designation: e.target.value })} 
                        className={styles.inlineInput}
                        title="Employee designation"
                      >
                        <option value="1">Full Stack Developer</option>
                        <option value="2">HR Executive</option>
                        <option value="3">Accountant</option>
                        <option value="4">Sales Executive</option>
                      </select>
                    </div>
                    <div className={styles.editFormCol}>
                      <label htmlFor="departmentSelect" className={styles.editLabel}>Department</label>
                      <select 
                        id="departmentSelect"
                        name="department" 
                        value={editFormData?.department || ''} 
                        onChange={(e) => handleTabFormChange({ department: e.target.value })} 
                        className={styles.inlineInput}
                        title="Employee department"
                      >
                        <option value="1">IT</option>
                        <option value="2">HR</option>
                        <option value="3">Finance</option>
                        <option value="4">Sales</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1>
                    {employee.name} 
                    <span className={styles.statusPill}>{String(employee.status || 'Active').toUpperCase()}</span>
                  </h1>
                  <p className={styles.roleDept}>
                    {String(designations[Number(employee.designation)] || employee.designation || '').toUpperCase()} • {String(departments[Number(employee.department)] || employee.department || '').toUpperCase()} • <span>{employee.id}</span>
                  </p>
                  <div className={styles.contactInfo}>
                    <span className={styles.contactItem}><Phone size={14} /> {employee.phone || '+1 234 567 890'}</span>
                    <span className={styles.contactItem}><Mail size={14} /> {employee.email || `${(employee.name || '').split(' ')[0].toLowerCase()}@company.com`}</span>
                  </div>
                  
                  <div className={styles.reportingManagerRow}>
                    <span className={styles.reportingManagerLabel}>Reporting Manager:</span>
                    {/* ---> CHANGED: Ensure the value is the Manager's ID, not their name */}
                    <select
                      value={getSelectValue()}
                      onChange={(e) => handleManagerChange(e.target.value)}
                      className={styles.reportingManagerInput}
                      title="Select reporting manager"
                    >
                      <option value="">No Manager</option>
                      {getAvailableManagers().map((mgr) => (
                        <option key={mgr.id} value={mgr.id}>
                          {mgr.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={`${styles.headerActions} ${styles.headerActionsWrapper}`}>
            {isEditing ? (
              <>
                <button className={styles.btnOutline} onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className={styles.btnPrimary} onClick={handleSaveEdit}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button className={styles.btnOutline} onClick={handleStartEdit}>
                  <Edit size={16} /> Edit Profile
                </button>
                <button className={styles.btnPrimary}>
                  <Download size={16} /> Export Data
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className={styles.tabContentArea}>
        {renderTabContent()}
      </div>
      
    </div>
  );
}

// ==========================================
// 4. EXPORTED LAYOUT COMPONENT
// ==========================================

/**
 * EmployeeDetails Component (Default Export)
 * 
 * Outer boundary parsing URL params and wrapping content inside the EmployeeProvider.
 */
export default function EmployeeDetails() {
  const { id } = useParams();

  if (!id) {
    return <div className={styles.errorWrapper}>Invalid Employee ID</div>;
  }

  return (
    <EmployeeProvider employeeId={id}>
      <EmployeeDetailsContent />
    </EmployeeProvider>
  );
}