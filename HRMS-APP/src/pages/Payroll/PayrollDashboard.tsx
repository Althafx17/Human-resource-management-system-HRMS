import { useState, useEffect } from 'react';
import { 
  Search, 
  Wallet, 
  Check, 
  TrendingDown, 
  Users, 
  Download, 
  Plus, 
  MoreVertical, 
  Eye, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { payrollApi } from '../../apis/finance/payrollApi';
import { employeeApi } from '../../apis/core/employeeApi';
import type { EmployeeData } from '../employees/types';
import styles from './PayrollDashboard.module.css';

interface PayrollRecord {
  id: string;
  employeeName: string;
  avatar: string;
  designation: string;
  month: string;
  basicSalary: number;
  deductions: number;
  netPay: number;
  status: 'Processed' | 'Pending' | 'On Hold';
}

export default function PayrollDashboard() {
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('June');
  const [year, setYear] = useState('2026');
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, EmployeeData>>({});
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadEmployeesAndPayroll = async () => {
      try {
        let allEmployees: EmployeeData[] = [];
        let page = 1;
        let hasMore = true;
        while (hasMore && page <= 10) {
          const data = await employeeApi.getAll(page);
          if (data.results && data.results.length > 0) {
            allEmployees = [...allEmployees, ...data.results];
            hasMore = !!data.next;
            page++;
          } else {
            hasMore = false;
          }
        }
        const map: Record<string, EmployeeData> = {};
        allEmployees.forEach(emp => {
          map[String(emp.id)] = emp;
        });
        setEmployeeMap(map);

        const payrollData = await payrollApi.getAll();
        const formatted: PayrollRecord[] = payrollData.map((item: any) => {
          const empId = String(item.employee || item.employee_id || '');
          const emp = map[empId];
          return {
            id: String(item.id || ''),
            employeeName: emp ? emp.name : (item.employeeName || item.employee_name || `Employee #${empId || 'Unknown'}`),
            avatar: emp ? (emp.avatar as string) : (item.avatar || ''),
            designation: emp ? emp.designation : (item.designation || item.employee_designation || ''),
            month: item.month || item.pay_period || '',
            basicSalary: Number(item.basicSalary || item.basic_salary || 0),
            deductions: Number(item.deductions || item.total_deductions || 0),
            netPay: Number(item.netPay || item.net_salary || 0),
            status: item.status || 'Pending'
          };
        });
        setRecords(formatted);
      } catch (err) {
        console.error('Failed to load payroll details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployeesAndPayroll();
  }, []);

  // Aggregates calculation
  // Total Payroll (processed only or sum of all?)
  // Let's match the requirements: Total Payroll e.g. $9,150, Processed e.g. 2, Deductions e.g. $250, Workforce e.g. 24
  const processedRecords = records.filter(r => r.status === 'Processed');
  const totalPayrollVal = processedRecords.reduce((sum, r) => sum + r.netPay, 0);
  const totalDeductionsVal = processedRecords.reduce((sum, r) => sum + r.deductions, 0);
  const processedCount = processedRecords.length;
  const totalWorkforce = Object.keys(employeeMap).length;

  const filteredRecords = records.filter(record => 
    record.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    record.designation.toLowerCase().includes(search.toLowerCase())
  );

  const handleProcessPayroll = () => {
    alert('Processing payroll for current cycle...');
    // Demo logic: Turn pending to processed
    setRecords(prev => prev.map(r => r.status === 'Pending' ? { ...r, status: 'Processed' } : r));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Processed': return styles.processed;
      case 'Pending': return styles.pending;
      case 'On Hold': return styles.onHold;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payroll Dashboard</h1>
          <p className={styles.subtitle}>Track employee earnings, taxes, deductions and process payouts.</p>
        </div>
      </div>

      {/* 1. Top Control Bar */}
      <div className={styles.controlBar}>
        <div className={styles.leftControls}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search employee or designation..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.selectGroup}>
            <select 
              className={styles.select} 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <select 
              className={styles.select} 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        <div className={styles.rightControls}>
          <button className={styles.secondaryBtn} onClick={() => alert('Exporting payroll data...')}>
            <Download size={16} />
            Export
          </button>
          <button className={styles.primaryBtn} onClick={handleProcessPayroll}>
            <Plus size={16} />
            Process Payroll
          </button>
        </div>
      </div>

      {/* 2. Statistics Cards Grid */}
      <div className={styles.statsGrid}>
        
        {/* Card 1: Total Payroll */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Total Payroll</span>
            <div className={`${styles.iconCircle} ${styles.iconPurple}`}>
              <Wallet size={20} />
            </div>
          </div>
          <h2 className={styles.cardValue}>
            ${totalPayrollVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <span className={styles.cardTrend}>For current cycle</span>
        </div>

        {/* Card 2: Processed */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Processed</span>
            <div className={`${styles.iconCircle} ${styles.iconGreen}`}>
              <Check size={20} />
            </div>
          </div>
          <h2 className={styles.cardValue}>{processedCount}</h2>
          <span className={styles.cardTrend}>Employees paid</span>
        </div>

        {/* Card 3: Deductions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Deductions</span>
            <div className={`${styles.iconCircle} ${styles.iconRed}`}>
              <TrendingDown size={20} />
            </div>
          </div>
          <h2 className={styles.cardValue}>
            ${totalDeductionsVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <span className={styles.cardTrend}>Taxes & adjustments</span>
        </div>

        {/* Card 4: Workforce */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Workforce</span>
            <div className={`${styles.iconCircle} ${styles.iconYellow}`}>
              <Users size={20} />
            </div>
          </div>
          <h2 className={styles.cardValue}>{totalWorkforce}</h2>
          <span className={styles.cardTrend}>Active employees</span>
        </div>

      </div>

      {/* 3. Data Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Basic Salary</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th className={styles.centerAlign}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className={styles.employeeCell}>
                      <img src={record.avatar} alt={record.employeeName} className={styles.avatar} />
                      <div className={styles.meta}>
                        <span className={styles.name}>{record.employeeName}</span>
                        <span className={styles.role}>{record.designation}</span>
                      </div>
                    </div>
                  </td>
                  <td>{record.month}</td>
                  <td>${record.basicSalary.toFixed(2)}</td>
                  <td className={styles.deductionText}>-${record.deductions.toFixed(2)}</td>
                  <td className={styles.netPayText}>${record.netPay.toFixed(2)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusStyle(record.status)}`}>
                      {record.status === 'Processed' ? (
                        <CheckCircle size={12} style={{ marginRight: '4px' }} />
                      ) : (
                        <AlertCircle size={12} style={{ marginRight: '4px' }} />
                      )}
                      {record.status}
                    </span>
                  </td>
                  <td className={styles.centerAlign}>
                    <div className={styles.actionCell}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => alert(`Viewing details for ${record.employeeName}`)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <div className={styles.menuContainer}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => setActiveMenuId(activeMenuId === record.id ? null : record.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenuId === record.id && (
                          <div className={styles.dropdownMenu}>
                            <button onClick={() => {
                              alert(`Regenerating payroll for ${record.employeeName}`);
                              setActiveMenuId(null);
                            }}>
                              Regenerate
                            </button>
                            <button onClick={() => {
                              alert(`Putting payroll on hold for ${record.employeeName}`);
                              setActiveMenuId(null);
                            }} className={styles.dangerOption}>
                              Hold Payout
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
