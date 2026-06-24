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

export const employeeData: EmployeeData[] = [
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
    skills: ['REACT', 'TYPESCRIPT', 'NODEJS', 'PYTHON'],
    contractType: 'Full-Time Permanent',
    contractStatus: 'Active',
    contractStart: '2022-01-10',
    contractEnd: '',
    contractFile: '',
    wageType: 'Monthly Salary',
    payrollRules: 'Standard tax bracket calculation',
    overtimeEligible: true,
    allowances: '',
    deductions: '',
    workArea: 'Headquarters',
    geoFence: '37.7749° N, 122.4194° W',
    attendanceRequired: true
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
    skills: ['FIGMA', 'UI/UX', 'ILLUSTRATOR', 'PHOTOSHOP'],
    contractType: 'Full-Time Permanent',
    contractStatus: 'Active',
    contractStart: '2023-03-15',
    contractEnd: '',
    contractFile: '',
    wageType: 'Monthly Salary',
    payrollRules: 'Standard tax bracket calculation',
    overtimeEligible: false,
    allowances: '',
    deductions: '',
    workArea: 'Headquarters',
    geoFence: '37.7749° N, 122.4194° W',
    attendanceRequired: true
  }
];

export function addEmployee(employee: EmployeeData): EmployeeData[] {
  employeeData.push(employee);
  return employeeData;
}

export function updateEmployee(id: string, updated: EmployeeData): EmployeeData[] {
  const idx = employeeData.findIndex(emp => emp.id === id);
  if (idx !== -1) {
    employeeData[idx] = updated;
  }
  return employeeData;
}
