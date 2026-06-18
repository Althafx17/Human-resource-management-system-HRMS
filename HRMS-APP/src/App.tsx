import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './Component/layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/Employees/Employees'; // Add this import
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The AppLayout acts as a wrapper for all pages inside it */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          
          {/* Future routes will go here, for example: */}
          {/* <Route path="employees" element={<EmployeesPage />} /> */}
          {/* <Route path="leave" element={<LeavePage />} /> */}
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}