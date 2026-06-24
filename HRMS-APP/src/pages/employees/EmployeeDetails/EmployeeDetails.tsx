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

const TABS = [
  { id: 'OVERVIEW', label: 'OVERVIEW', icon: Eye },
  { id: 'JOB_DETAILS', label: 'JOB DETAILS', icon: Briefcase },
  { id: 'PAYROLL', label: 'PAYROLL', icon: DollarSign },
  { id: 'CONTRACT', label: 'CONTRACT', icon: FileText },
  { id: 'DOCUMENTS', label: 'DOCUMENTS', icon: ShieldCheck },
];

// 2. A Mock Database representing what your Django API will eventually return
const MOCK_DATABASE: EmployeeData[] = [
  { id: 'EMP001', name: 'John Smith', designation: 'Sr.Back End Developer', department: 'Engineering', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'EMP002', name: 'Sara John', designation: 'Sr.UI UX Designer', department: 'Design', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
  // Adding a fallback default so the app doesn't crash if an unknown ID is clicked
  { id: 'DEFAULT', name: 'New Employee', designation: 'Staff', department: 'General', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=new' }
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
    const foundEmployee = MOCK_DATABASE.find(emp => emp.id === id) || MOCK_DATABASE.find(emp => emp.id === 'DEFAULT');
    setEmployeeData(foundEmployee || null);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'OVERVIEW': return <OverviewTab />;
      case 'JOB_DETAILS': return <JobDetailsTab />;
      case 'PAYROLL': return <PayrollTab />;
      case 'CONTRACT': return <ContractTab />;
      case 'DOCUMENTS': return <DocumentsTab />;
      default: return <OverviewTab />;
    }
  };

  const handleSaveEdit = (updatedData: EmployeeData) => {
    setEmployeeData(updatedData);
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
                <span className={styles.contactItem}><Phone size={14} /> +1 234 567 890</span>
                <span className={styles.contactItem}><Mail size={14} /> {employeeData.name.split(' ')[0].toLowerCase()}@company.com</span>
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