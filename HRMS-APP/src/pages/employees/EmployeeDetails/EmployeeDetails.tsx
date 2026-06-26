import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // 1. Added useParams
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

const TABS = [
  { id: 'OVERVIEW', label: 'OVERVIEW', icon: Eye },
  { id: 'JOB_DETAILS', label: 'JOB DETAILS', icon: Briefcase },
  { id: 'PAYROLL', label: 'PAYROLL', icon: DollarSign },
  { id: 'CONTRACT', label: 'CONTRACT', icon: FileText },
  { id: 'DOCUMENTS', label: 'DOCUMENTS', icon: ShieldCheck },
];

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // 3. This grabs the ID from the URL (e.g., 'EMP002')
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<EmployeeData | null>(null);

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managers, setManagers] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Record<number, string>>({});
  const [designations, setDesignations] = useState<Record<number, string>>({});

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setEmployee(null);
    setIsEditing(false);
    setEditFormData(null);
    setIsLoading(true);
    setError(null);
  }

  // Fetch departments and designations lookups
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

  // Fetch employee details by ID
  useEffect(() => {
    if (!id) return;
    let active = true;
    
    employeeApi.getById(id)
      .then(data => {
        if (active) {
          setEmployee(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          console.error(err);
          setError('Failed to load employee profile.');
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Fetch all employees to populate the managers dropdown
  useEffect(() => {
    employeeApi.getAll()
      .then(res => {
        const list = res.results || [];
        const managersFromEmployees = list
          .filter(emp => {
            const des = String(emp.designation || '').toLowerCase();
            return des.includes('manager') || des.includes('lead') || des.includes('director') || des.includes('head') || des.includes('vp') || des.includes('chief');
          })
          .map(emp => emp.name);
        setManagers(managersFromEmployees);
      })
      .catch(err => {
        console.error('Failed to load managers:', err);
      });
  }, []);

  const handleTabFormChange = (fields: Partial<EmployeeData>) => {
    setEditFormData(prev => prev ? { ...prev, ...fields } : null);
  };

  const renderTabContent = () => {
    if (!employee) return null;
    const currentData = isEditing && editFormData ? editFormData : employee;
    const displayEmployee = {
      ...currentData,
      department: departments[Number(currentData.department)] || currentData.department,
      designation: designations[Number(currentData.designation)] || currentData.designation,
    };
    switch (activeTab) {
      case 'OVERVIEW': return <OverviewTab employee={displayEmployee} isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} onSave={handleSaveEdit} onCancel={handleCancelEdit} />;
      case 'JOB_DETAILS': return <JobDetailsTab employee={displayEmployee} isEditing={isEditing} editData={editFormData} onChange={handleTabFormChange} />;
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

  const getAvailableManagers = () => {
    const defaultManagers = ['Sarah Connor', 'Sarah John', 'John Smith']; 
    const currentManager = employee?.reportingManager;
    
    return Array.from(new Set([
      ...(currentManager ? [currentManager] : []),
      ...managers,
      ...defaultManagers
    ])).filter(name => name !== employee?.name);
  };

  const handleManagerChange = (managerName: string) => {
    if (!employee || !id) return;
    
    employeeApi.update(id, { reportingManager: managerName })
      .then((updated) => {
        setEmployee(updated);
        showToast('Reporting manager updated successfully!', 'success');
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to update reporting manager', 'error');
      });
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.headerWrapper}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: '80px', height: '80px', borderRadius: '16px' }}></div>
              <div className={styles.details} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className={styles.skeleton} style={{ width: '200px', height: '24px' }}></div>
                <div className={styles.skeleton} style={{ width: '150px', height: '16px' }}></div>
                <div className={styles.skeleton} style={{ width: '250px', height: '14px' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.card} style={{ marginTop: '24px', minHeight: '200px' }}>
          <div className={styles.skeleton} style={{ width: '100px', height: '20px', marginBottom: '16px' }}></div>
          <div className={styles.skeleton} style={{ width: '100%', height: '100px' }}></div>
        </div>
      </div>
    );
  }
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>;
  if (!employee) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Employee profile not found.</div>;

  return (
    <div className={styles.page}>
      
      <div className={styles.headerWrapper}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className={styles.profileHeader}>
          <div className={styles.profileInfo} style={{ width: '100%' }}>
            <div className={styles.avatarPlaceholder}>
              <img src={employee.avatar} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover'}} />
            </div>
            <div className={styles.details} style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '500px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={editFormData?.name || ''} 
                        onChange={(e) => handleTabFormChange({ name: e.target.value })} 
                        className={styles.inlineInput} 
                      />
                    </div>
                    <div style={{ width: '120px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</label>
                      <select 
                        name="status" 
                        value={editFormData?.status || ''} 
                        onChange={(e) => handleTabFormChange({ status: e.target.value as any })} 
                        className={styles.inlineInput}
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="In Active">In Active</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Designation</label>
                      <select 
                        name="designation" 
                        value={editFormData?.designation || ''} 
                        onChange={(e) => handleTabFormChange({ designation: e.target.value })} 
                        className={styles.inlineInput}
                      >
                        <option value="1">Full Stack Developer</option>
                        <option value="2">HR Executive</option>
                        <option value="3">Accountant</option>
                        <option value="4">Sales Executive</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Department</label>
                      <select 
                        name="department" 
                        value={editFormData?.department || ''} 
                        onChange={(e) => handleTabFormChange({ department: e.target.value })} 
                        className={styles.inlineInput}
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
                  
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Reporting Manager:</span>
                    <select
                      value={employee.reportingManager || ''}
                      onChange={(e) => handleManagerChange(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1a3646',
                        outline: 'none',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <option value="">No Manager</option>
                      {getAvailableManagers().map((managerName) => (
                        <option key={managerName} value={managerName}>
                          {managerName}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.headerActions} style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', flexShrink: 0 }}>
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