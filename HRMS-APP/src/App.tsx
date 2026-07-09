import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './Component/layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/employees/Employees';
import Attendance from './pages/attendence/attendence';
import WorkAreas from './pages/workarea/WorkArea';
import ShiftAdminLayout from './pages/Shifts/ShiftAdminLayout';
import Leave from './pages/Leave/Leave';
import Overtime from './pages/Overtime/Overtime';
import Expenses from './pages/Expenses/Expenses';
import PayrollDashboard from './pages/Payroll/PayrollDashboard';
import EmployeeDetails from './pages/employees/EmployeeDetails/EmployeeDetails';
import AddEmployeeWizard from './pages/employees/add-employee/AddEmployeeWizard';
import Login from './pages/login/Login';
import SignupEmail from './pages/auth/SignupEmail';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupEmail />} />
        <Route path="/verify-otp" element={<div>Verify OTP Page Placeholder</div>} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* AppLayout acts as a wrapper containing your Sidebar/Navbar */}
          <Route path="/" element={<AppLayout />}>
            {/* Default view when a user lands on the base URL "/" */}
            <Route index element={<Dashboard />} />

            <Route path="employees" element={<Employees />} />
            <Route path="employees/add" element={<AddEmployeeWizard />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />

            <Route path="attendance" element={<Attendance />} />

            <Route path="work-areas" element={<WorkAreas />} />

            <Route path="shifts" element={<ShiftAdminLayout />} />

            <Route path="leave" element={<Leave />} />

            <Route path="overtime" element={<Overtime />} />

            <Route path="expenses" element={<Expenses />} />
            
            <Route path="payroll" element={<PayrollDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}