export interface EmployeeData {
  id: string;
  name: string;
  avatar: string;
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
}

export const employeeData: EmployeeData[];

export function addEmployee(employee: EmployeeData): EmployeeData[];