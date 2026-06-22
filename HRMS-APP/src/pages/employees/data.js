export const employeeData = [
  { id: 'EMP001', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1', designation: 'Sr.Back End Developer', department: 'Development', status: 'Active' },
  { id: 'EMP002', name: 'Sara John', avatar: 'https://i.pravatar.cc/150?u=2', designation: 'Sr.UI UX Designer', department: 'Design', status: 'Active' },
  { id: 'EMP003', name: 'Angel Philip', avatar: 'https://i.pravatar.cc/150?u=3', designation: 'Finance Manager', department: 'Finance', status: 'On Leave' },
  { id: 'EMP004', name: 'Anmariya', avatar: 'https://i.pravatar.cc/150?u=4', designation: 'Mern Stack Developer', department: 'Design', status: 'Active' },
  { id: 'EMP005', name: 'Augestien', avatar: 'https://i.pravatar.cc/150?u=5', designation: 'Sr.Graphics Designer', department: 'Design', status: 'In Active' },
  { id: 'EMP006', name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?u=6', designation: 'Marketing Manager', department: 'Marketing', status: 'Active' },
];

export function addEmployee(employee) {
  employeeData.push(employee);
  return employeeData;
}