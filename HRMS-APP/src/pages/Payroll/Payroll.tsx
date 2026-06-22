import { useState } from 'react';
import { Search, DollarSign, CreditCard, TrendingUp, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import styles from './Payroll.module.css';

interface PayrollRecord {
  id: string;
  employeeName: string;
  avatar: string;
  designation: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Processing' | 'On Hold';
}

const DUMMY_PAYROLL: PayrollRecord[] = [
  { id: 'PAY001', employeeName: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1', designation: 'Sr. Back End Developer', baseSalary: 4500.00, allowances: 350.00, deductions: 120.00, netPay: 4730.00, status: 'Paid' },
  { id: 'PAY002', employeeName: 'Sara John', avatar: 'https://i.pravatar.cc/150?u=2', designation: 'Sr. UI UX Designer', baseSalary: 4200.00, allowances: 200.00, deductions: 100.00, netPay: 4300.00, status: 'Paid' },
  { id: 'PAY003', employeeName: 'Angel Philip', avatar: 'https://i.pravatar.cc/150?u=3', designation: 'Finance Manager', baseSalary: 5000.00, allowances: 400.00, deductions: 150.00, netPay: 5250.00, status: 'Processing' },
  { id: 'PAY004', employeeName: 'Anmariya', avatar: 'https://i.pravatar.cc/150?u=4', designation: 'Mern Stack Developer', baseSalary: 3800.00, allowances: 150.00, deductions: 80.00, netPay: 3870.00, status: 'On Hold' },
];

export default function Payroll() {
  const [search, setSearch] = useState('');

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Paid': return styles.paid;
      case 'Processing': return styles.processing;
      case 'On Hold': return styles.onHold;
      default: return '';
    }
  };

  const filteredPayroll = DUMMY_PAYROLL.filter(record =>
    record.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    record.designation.toLowerCase().includes(search.toLowerCase())
  );

  // Financial aggregates calculations
  const totalNetPay = DUMMY_PAYROLL.reduce((sum, item) => sum + item.netPay, 0);
  const totalDeductions = DUMMY_PAYROLL.reduce((sum, item) => sum + item.deductions, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Payroll Management</h1>

      {/* Salary Overview Scoreboard Row */}
      <div className={styles.summaryRow}>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconGreen}`}><DollarSign size={20} /></div>
          <div><h4>${totalNetPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4><p>Total Net Outlay</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconRed}`}><TrendingUp size={20} style={{ transform: 'rotate(180deg)' }} /></div>
          <div><h4>${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4><p>Total System Deductions</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconBlue}`}><CreditCard size={20} /></div>
          <div><h4>June 2026</h4><p>Current Pay Cycle</p></div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search employee or role..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.primaryBtn}>
          <FileSpreadsheet size={18} /> Run Payroll
        </button>
      </div>

      {/* Payroll Statement Records Table Sheet */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Base Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayroll.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>
                  <div className={styles.employeeCell}>
                    <img src={record.avatar} alt={record.employeeName} className={styles.avatar} />
                    <div className={styles.meta}>
                      <span className={styles.name}>{record.employeeName}</span>
                      <span className={styles.role}>{record.designation}</span>
                    </div>
                  </div>
                </td>
                <td>${record.baseSalary.toFixed(2)}</td>
                <td className={styles.greenText}>+${record.allowances.toFixed(2)}</td>
                <td className={styles.redText}>-${record.deductions.toFixed(2)}</td>
                <td className={styles.netPayCell}>${record.netPay.toFixed(2)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(record.status)}`}>
                    {record.status === 'Paid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    <span style={{ marginLeft: '4px' }}>{record.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}