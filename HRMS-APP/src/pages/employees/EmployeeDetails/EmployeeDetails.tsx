import { useState } from 'react';
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
import type { EmployeeData } from '../data';
import { employeeData as allEmployees } from '../data';

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

  const [prevId, setPrevId] = useState<string | undefined>(undefined);
  // 4. Start the state as null, we will fill it once we read the URL
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  // 5. This block acts like your API call. It runs every time the URL 'id' changes during rendering.
  if (id !== prevId) {
    setPrevId(id);
    const foundEmployee = allEmployees.find(emp => emp.id === id) || allEmployees.find(emp => emp.id === 'DEFAULT') || allEmployees[0];
    setEmployeeData(foundEmployee || null);
  }

  const renderTabContent = () => {
    if (!employeeData) return null;
    switch (activeTab) {
      case 'OVERVIEW': return <OverviewTab employee={employeeData} />;
      case 'JOB_DETAILS': return <JobDetailsTab employee={employeeData} />;
      case 'PAYROLL': return <PayrollTab employee={employeeData} />;
      case 'CONTRACT': return <ContractTab />;
      case 'DOCUMENTS': return <DocumentsTab />;
      default: return <OverviewTab employee={employeeData} />;
    }
  };

  const handleSaveEdit = (updatedData: EmployeeData) => {
    const idx = allEmployees.findIndex(emp => emp.id === updatedData.id);
    if (idx !== -1) {
      allEmployees[idx] = updatedData;
    }
    setEmployeeData(updatedData);
  };

  const getAvailableManagers = () => {
    // 1. Gather all employees whose designation contains manager/lead keywords
    const managersFromEmployees = allEmployees
      .filter(emp => {
        const des = (emp.designation || '').toLowerCase();
        return des.includes('manager') || des.includes('lead') || des.includes('director') || des.includes('head') || des.includes('vp') || des.includes('chief');
      })
      .map(emp => emp.name);

    // 2. Default mock managers
    const defaultManagers = ['Sarah Connor', 'Sarah John', 'John Smith']; 
    
    // 3. Current reporting manager
    const currentManager = employeeData?.reportingManager;
    
    // Combine, remove duplicates, and filter out current employee's own name
    return Array.from(new Set([
      ...(currentManager ? [currentManager] : []),
      ...managersFromEmployees,
      ...defaultManagers
    ])).filter(name => name !== employeeData?.name);
  };

  const handleManagerChange = (managerName: string) => {
    if (!employeeData) return;
    const updated = {
      ...employeeData,
      reportingManager: managerName
    };
    
    const idx = allEmployees.findIndex(emp => emp.id === employeeData.id);
    if (idx !== -1) {
      allEmployees[idx] = updated;
    }
    setEmployeeData(updated);
  };

  // 6. Show a loading state while we "fetch" the data
  if (!employeeData) return <div style={{ padding: '40px' }}>Loading Employee Profile...</div>;

  return (
    <div className={styles.page}>
      
      <div className={styles.headerWrapper}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarPlaceholder}>
              <img src={employeeData.avatar} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover'}} />
            </div>
            <div className={styles.details}>
              <h1>
                {employeeData.name} 
                <span className={styles.statusPill}>{employeeData.status.toUpperCase()}</span>
              </h1>
              <p className={styles.roleDept}>
                {employeeData.designation.toUpperCase()} • {employeeData.department.toUpperCase()} • <span>{employeeData.id}</span>
              </p>
              <div className={styles.contactInfo}>
                <span className={styles.contactItem}><Phone size={14} /> {employeeData.phone || '+1 234 567 890'}</span>
                <span className={styles.contactItem}><Mail size={14} /> {employeeData.email || `${employeeData.name.split(' ')[0].toLowerCase()}@company.com`}</span>
              </div>
              
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Reporting Manager:</span>
                <select
                  value={employeeData.reportingManager || ''}
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
        employeeData={employeeData}
        onSave={handleSaveEdit}
      />
      
    </div>
  );
}