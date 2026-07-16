export interface EmployeeData {
  id: string;
  name: string;
  avatar: string | File;
  designation: string;
  department: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'suspended'|'';
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
  isManager?: boolean;
  managerRole?: string;
  
  // Step 3
  contractType?: string;
  contractStatus?: 'Active' | 'Suspended' | 'Expired' | 'Pending' | '';
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

export interface LeaveRequest {
  id?: number;
  employee_id: number;
  leave_type: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PayrollRecord {
  id?: number;
  employee_id: number;
  month: number; // 1-12
  year: number;
  basic_salary: string | number;
  deductions: string | number;
  net_pay: string | number;
  status: 'Pending' | 'Paid';
}

export interface OvertimeRecord {
  id?: number;
  employee_id: number;
  date: string; // YYYY-MM-DD
  hours: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ExpenseClaim {
  id?: number;
  employee_id: number;
  category: string;
  amount: string | number;
  date: string; // YYYY-MM-DD
  description: string;
  receipt_url: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
}
