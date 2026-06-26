export interface EmployeeData {
  id: string;
  name: string;
  avatar: string | File;
  designation: string;
  department: string;
  status: 'Active' | 'On Leave' | 'In Active';
  phone?: string;
  email?: string;
  dob?: string;
  address?: string;
  joiningDate?: string;
  reportingManager?: string;
  workLocation?: string;
  shift?: string;
  basicSalary?: string;
  paymentFrequency?: string;
  bankName?: string;
  accountNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  skills?: string[];
  
  // Step 3
  contractType?: string;
  contractStatus?: string;
  contractStart?: string;
  contractEnd?: string;
  contractFile?: string;
  
  // Step 4
  wageType?: string;
  payrollRules?: string;
  overtimeEligible?: boolean;
  allowances?: string;
  deductions?: string;
  
  // Step 5
  workArea?: string;
  geoFence?: string;
  attendanceRequired?: boolean;
  
  // Step 6
  resumeFile?: string;
  certificatesFile?: string;
}
