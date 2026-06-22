import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, Edit, Download, 
  Eye, Briefcase, DollarSign, FileText, ShieldCheck 
} from 'lucide-react';
import styles from './EmployeeDetails.module.css';

// Import our new modular tabs
import OverviewTab from './tab/OverviewTab';
import JobDetailsTab from './tab/JobDetailsTab';
import PayrollTab from './tab/PayrollTab';
import ContractTab from './tab/ContractTab';
import DocumentsTab from './tab/DocumentsTab';

// Import the Edit Modal we built previously
import EditEmployeeModal from '../EditEmployeeModal';

const TABS = [
  { id: 'OVERVIEW', label: 'OVERVIEW', icon: Eye },
  { id: 'JOB_DETAILS', label: 'JOB DETAILS', icon: Briefcase },
  { id: 'PAYROLL', label: 'PAYROLL', icon: DollarSign },
  { id: 'CONTRACT', label: 'CONTRACT', icon: FileText },
  { id: 'DOCUMENTS', label: 'DOCUMENTS', icon: ShieldCheck },
];

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // In a real app, you would fetch this data via API based on the URL ID parameter.
  // For now, we hold it in state so we can see the edits update locally.
  const [employeeData, setEmployeeData] = useState({
    id: 'EMP001',
    name: 'John Doe',
    designation: 'Frontend Developer',
    department: 'Engineering',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=1'
  });

  // Function to render the correct component based on the active tab
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

  // Handle saving data from the Edit Modal
  const handleSaveEdit = (updatedData: any) => {
    setEmployeeData(updatedData);
    // TODO: In the future, send an Axios PUT request to your Django API here!
  };

  return (
    <div className={styles.page}>
      
      <div className={styles.headerWrapper}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarPlaceholder}>
              {/* Uses the state data so it updates if changed */}
              <img src={employeeData.avatar} alt="Avatar" className={styles.avatarImage} />
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
                <span className={styles.contactItem}><Mail size={14} /> john.doe@company.com</span>
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            {/* Trigger the Edit Modal */}
            <button type="button" className={styles.btnOutline} onClick={() => setIsEditModalOpen(true)} title="Edit profile" aria-label="Edit profile">
              <Edit size={16} /> Edit Profile
            </button>
            <button type="button" className={styles.btnPrimary} title="Export data" aria-label="Export data">
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

      {/* Render the dynamically selected tab component */}
      <div className={styles.tabContentArea}>
        {renderTabContent()}
      </div>

      {/* Render the Edit Modal Component */}
      <EditEmployeeModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employeeData={employeeData}
        onSave={handleSaveEdit}
      />
      
    </div>
  );
}