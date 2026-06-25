import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Briefcase, FileText, 
  DollarSign, MapPin, ShieldCheck, ChevronRight, ChevronLeft 
} from 'lucide-react';
import styles from './AddEmployee.module.css';

// Import step components
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2JobDetails from './Step2JobDetails';
import Step3Contract from './Step3Contract';
import Step4Payroll from './Step4Payroll';
import Step5WorkArea from './Step5WorkArea';
import Step6Documents from './Step6Documents';

import type { EmployeeData } from '../../types';
import { employeeApi } from '../../../../services/employeeApi';

interface AddEmployeeWizardProps {
  isEditMode?: boolean;
  initialData?: Partial<EmployeeData> & Record<string, unknown>;
}

const STEPS_CONFIG = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Job Details', icon: Briefcase },
  { id: 3, label: 'Contract', icon: FileText },
  { id: 4, label: 'Payroll', icon: DollarSign },
  { id: 5, label: 'Work Area', icon: MapPin },
  { id: 6, label: 'Documents & Skills', icon: ShieldCheck },
];

export default function AddEmployeeWizard({ isEditMode = false, initialData }: AddEmployeeWizardProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [prevInitialData, setPrevInitialData] = useState<Partial<EmployeeData> | null | undefined>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Master form state holding all fields from steps 1 to 6
  const [formData, setFormData] = useState({
    id: '',
    // Step 1: Personal Info
    name: '',
    dob: '',
    phone: '',
    emergencyContactName: '',
    address: '',
    avatar: 'https://i.pravatar.cc/150?u=new', // default placeholder
    
    // Step 2: Job Details
    department: '',
    designation: '',
    reportingManager: '',
    joiningDate: '',
    employmentType: '',
    status: 'Active' as EmployeeData['status'],
    
    // Step 3: Contract
    contractType: '',
    contractStatus: '',
    contractStart: '',
    contractEnd: '',
    contractFile: '',
    
    // Step 4: Payroll
    wageType: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payrollRules: '',
    overtimeEligible: false,
    
    // Step 5: Work Area
    workArea: '',
    geoFence: '',
    shift: '',
    attendanceRequired: false,
    
    // Step 6: Documents & Skills
    resumeFile: '',
    certificatesFile: '',
    skills: ''
  });

  // Sync state with props during render when editing and initialData changes
  if (isEditMode && initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Convert skills array back to comma-separated list if editing
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : ((initialData.skills as string) || '')
      }));
    }
  }

  // Master helper to update specific fields in form state
  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalize Registration / Save Profile
      let empId = formData.id;
      if (!isEditMode && !empId) {
        empId = `EMP${Math.floor(100 + Math.random() * 900)}`;
      }

      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

      const payload: EmployeeData = {
        ...formData,
        id: empId,
        skills: skillsArray
      };

      setIsSubmitting(true);
      const apiCall = isEditMode
        ? employeeApi.update(payload.id, payload)
        : employeeApi.create(payload);

      apiCall
        .then(() => {
          setIsSubmitting(false);
          alert(isEditMode ? 'Employee profile updated successfully!' : 'Employee registered successfully!');
          navigate('/employees');
        })
        .catch(err => {
          setIsSubmitting(false);
          console.error(err);
          alert('An error occurred: ' + (err.message || 'unknown error'));
        });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDiscard = () => {
    if (window.confirm(isEditMode ? 'Are you sure you want to discard your changes?' : 'Are you sure you want to discard this registration?')) {
      navigate('/employees');
    }
  };

  // Render Step component dynamically
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo data={formData} updateData={updateFormData} />;
      case 2:
        return <Step2JobDetails data={formData} updateData={updateFormData} />;
      case 3:
        return <Step3Contract data={formData} updateData={updateFormData} />;
      case 4:
        return <Step4Payroll data={formData} updateData={updateFormData} />;
      case 5:
        return <Step5WorkArea data={formData} updateData={updateFormData} />;
      case 6:
        return <Step6Documents data={formData} updateData={updateFormData} />;
      default:
        return <Step1PersonalInfo data={formData} updateData={updateFormData} />;
    }
  };

  // Stepper progress calculation
  const progressPercent = ((currentStep - 1) / 5) * 100;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerWrapper}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back" title="Go back">
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerText}>
          <h1>{isEditMode ? 'Edit Employee Profile' : 'Add New Employee'}</h1>
          <p>{isEditMode ? 'Modify employee details across different sections.' : 'Follow the steps to register a new employee.'}</p>
        </div>
      </div>

      {/* Stepper progress indicator */}
      <div className={styles.stepperContainer}>
        <div className={styles.progressLine}>
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
        </div>

        {STEPS_CONFIG.map(step => {
          const StepIcon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          let circleClass = styles.stepCircle;
          let labelClass = styles.stepLabel;

          if (isActive) {
            circleClass += ` ${styles.stepCircleActive}`;
            labelClass += ` ${styles.stepLabelActive}`;
          } else if (isCompleted) {
            circleClass += ` ${styles.stepCircleCompleted}`;
            labelClass += ` ${styles.stepLabelCompleted}`;
          }

          return (
            <div key={step.id} className={styles.stepNode}>
              <div className={circleClass} onClick={() => step.id < currentStep && setCurrentStep(step.id)} style={{ cursor: step.id < currentStep ? 'pointer' : 'default' }}>
                <StepIcon size={18} />
              </div>
              <span className={labelClass}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step Form Wrapper */}
      <div>
        {renderStepComponent()}
      </div>

      {/* Footer Navigation Bar */}
      <div className={styles.footer}>
        {currentStep > 1 ? (
          <button type="button" className={styles.btnSec} onClick={handleBack} disabled={isSubmitting}>
            <ChevronLeft size={16} /> Back
          </button>
        ) : (
          <div /> // empty placeholder to push discard and next to the right
        )}

        <div className={styles.footerRight}>
          <button type="button" className={styles.btnDiscard} onClick={handleDiscard} disabled={isSubmitting}>
            Discard
          </button>
          <button type="button" className={styles.btnPrimary} onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? (
              'Saving...'
            ) : currentStep === 6 ? (
              isEditMode ? 'Save Profile' : 'Finalize Registration'
            ) : (
              <>Next Step <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
