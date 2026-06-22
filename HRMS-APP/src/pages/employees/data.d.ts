export interface EmployeeData {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  department: string;
  status: 'Active' | 'On Leave' | 'In Active';
}

export const employeeData: EmployeeData[];

export function addEmployee(employee: EmployeeData): EmployeeData[];