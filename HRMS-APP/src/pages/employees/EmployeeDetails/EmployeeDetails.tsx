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
  {
    id: 'EMP001',
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?u=1',
    designation: 'Sr.Back End Developer',
    department: 'Engineering',
    status: 'Active',
    phone: '+1 234 567 890',
    email: 'john.smith@company.com',
    dob: '1990-05-15',
    address: '123 Tech Street, CA',
    joiningDate: '2022-01-10',
    reportingManager: 'Sarah Connor',
    workLocation: 'San Francisco (Hybrid)',
    shift: 'Standard (9:00 AM - 5:00 PM)',
    basicSalary: '$95,000 / Year',
    paymentFrequency: 'Bi-Weekly',
    bankName: 'Chase Bank',
    accountNumber: '**** **** 4321',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1 234 567 891',
    skills: ['REACT', 'TYPESCRIPT', 'NODEJS', 'PYTHON']
  },
  {
    id: 'EMP002',
    name: 'Sara John',
    avatar: 'https://i.pravatar.cc/150?u=2',
    designation: 'Sr.UI UX Designer',
    department: 'Design',
    status: 'Active',
    phone: '+1 234 567 892',
    email: 'sara.john@company.com',
    dob: '1992-08-20',
    address: '456 Art Ave, SF',
    joiningDate: '2023-03-15',
    reportingManager: 'Sarah Connor',
    workLocation: 'San Francisco (Hybrid)',
    shift: 'Standard (9:00 AM - 5:00 PM)',
    basicSalary: '$90,000 / Year',
    paymentFrequency: 'Bi-Weekly',
    bankName: 'Wells Fargo',
    accountNumber: '**** **** 8765',
    emergencyContactName: 'Robert John',
    emergencyContactPhone: '+1 234 567 893',
    skills: ['FIGMA', 'UI/UX', 'ILLUSTRATOR', 'PHOTOSHOP']
  },
  // Adding a fallback default so the app doesn't crash if an unknown ID is clicked
  {
    id: 'DEFAULT',
    name: 'New Employee',
    avatar: 'https://i.pravatar.cc/150?u=new',
    designation: 'Staff',
    department: 'General',
    status: 'Active',
    phone: '+1 000 000 0000',
    email: 'new.employee@company.com',
    dob: '1995-01-01',
    address: '123 Main Street',
    joiningDate: '2026-06-01',
    reportingManager: 'None',
    workLocation: 'Remote',
    shift: 'Standard (9:00 AM - 5:00 PM)',
    basicSalary: '$50,000 / Year',
    paymentFrequency: 'Monthly',
    bankName: 'Generic Bank',
    accountNumber: '**** **** 0000',
    emergencyContactName: 'Next of Kin',
    emergencyContactPhone: '+1 000 000 0001',
    skills: []
  }
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
                <span className={styles.contactItem}><Phone size={14} /> {employeeData.phone || '+1 234 567 890'}</span>
                <span className={styles.contactItem}><Mail size={14} /> {employeeData.email || `${employeeData.name.split(' ')[0].toLowerCase()}@company.com`}</span>
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