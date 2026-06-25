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
import EditEmployeeModal from '../EditEmployeeModal';
import type { EmployeeData } from '../types';
import { employeeApi } from '../../../services/employeeApi';

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
  
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managers, setManagers] = useState<string[]>([]);

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setEmployee(null);
    setIsLoading(true);
    setError(null);
  }

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
      .then(allEmployees => {
        const managersFromEmployees = allEmployees
          .filter(emp => {
            const des = (emp.designation || '').toLowerCase();
            return des.includes('manager') || des.includes('lead') || des.includes('director') || des.includes('head') || des.includes('vp') || des.includes('chief');
          })
          .map(emp => emp.name);
        setManagers(managersFromEmployees);
      })
      .catch(err => {
        console.error('Failed to load managers:', err);
      });
  }, []);

  const renderTabContent = () => {
    if (!employee) return null;
    switch (activeTab) {
      case 'OVERVIEW': return <OverviewTab employee={employee} />;
      case 'JOB_DETAILS': return <JobDetailsTab employee={employee} />;
      case 'PAYROLL': return <PayrollTab employee={employee} />;
      case 'CONTRACT': return <ContractTab employee={employee} />;
      case 'DOCUMENTS': return <DocumentsTab employee={employee} />;
      default: return <OverviewTab employee={employee} />;
    }
  };

  const handleSaveEdit = (updatedData: EmployeeData) => {
    setEmployee(updatedData);
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
      })
      .catch(err => {
        console.error(err);
        alert('Failed to update reporting manager: ' + (err.message || 'unknown error'));
      });
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading Employee Profile...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>;
  if (!employee) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Employee profile not found.</div>;

  return (
    <div className={styles.page}>
      
      <div className={styles.headerWrapper}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarPlaceholder}>
              <img src={employee.avatar} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover'}} />
            </div>
            <div className={styles.details}>
              <h1>
                {employee.name} 
                <span className={styles.statusPill}>{employee.status.toUpperCase()}</span>
              </h1>
              <p className={styles.roleDept}>
                {employee.designation.toUpperCase()} • {employee.department.toUpperCase()} • <span>{employee.id}</span>
              </p>
              <div className={styles.contactInfo}>
                <span className={styles.contactItem}><Phone size={14} /> {employee.phone || '+1 234 567 890'}</span>
                <span className={styles.contactItem}><Mail size={14} /> {employee.email || `${employee.name.split(' ')[0].toLowerCase()}@company.com`}</span>
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
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.btnOutline} onClick={() => setIsEditModalOpen(true)}>
              <Edit size={16} /> Edit Profile
            </button>
            <button className={styles.btnPrimary}>
              <Download size={16} /> Export Data
            </button>
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

      <EditEmployeeModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employeeData={employee}
        onSaveSuccess={handleSaveEdit}
      />
      
    </div>
  );
}