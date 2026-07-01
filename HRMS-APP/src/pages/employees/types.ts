export interface EmployeeData {
  id: string;
  name: string;
  avatar: string | File;
  designation: string;
  department: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'In Active';
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
  employee_id: number | string;
  leave_type: string; // e.g. 'Casual', 'Sick', 'Maternity', 'LWP'
  start_date: string; // Format: "YYYY-MM-DD"
  end_date: string; // Format: "YYYY-MM-DD"
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: number | string | null;
  created_at?: string;
}

export interface ExpenseClaim {
  id?: number;
  employee_id: number | string;
  expense_date: string; // Format: "YYYY-MM-DD"
  category: string; // e.g. 'Travel', 'Meals', 'Equipment', 'Others'
  amount: string; // decimal string, e.g. "120.50"
  description?: string;
  receipt_file?: string | File | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: number | string | null;
  created_at?: string;
}

export interface PayrollRecord {
  id?: number;
  employee_id: number | string;
  pay_period_start: string; // Format: "YYYY-MM-DD"
  pay_period_end: string; // Format: "YYYY-MM-DD"
  basic_salary: string; // decimal string
  allowances?: string; // decimal string
  deductions?: string; // decimal string
  net_pay: string; // decimal string
  payment_status: 'Paid' | 'Unpaid' | 'Processing';
  processed_at?: string | null;
}
