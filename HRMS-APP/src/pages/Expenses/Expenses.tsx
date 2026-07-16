// ---> CHANGED: Connect to database for expense claims, map employee names, and wire onClaimSuccess
import { useState, useEffect } from 'react';
import { Search, Plus, FileText, DollarSign, Wallet, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';
import { expenseApi } from '../../apis/finance/expenseApi';
import type { ExpenseClaim } from '../../apis/finance/expenseApi';
import { employeeApi } from '../../apis/core/employeeApi';
import type { EmployeeData } from '../employees/types';
import styles from './Expenses.module.css';
import ExpenseForm from '../../components/forms/ExpenseForm';

export default function Expenses() {
  const [search, setSearch] = useState('');
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, EmployeeData>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClaims = () => {
    setIsLoading(true);
    const loadEmployeesAndClaims = async () => {
      try {
        // Load employees list to build cache map
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

        // Fetch claims
        const data = await expenseApi.getExpenses();
        const formatted: ExpenseClaim[] = data.map((item: any) => {
          const empId = String(item.employee || item.employee_id || '');
          const emp = map[empId];
          return {
            id: item.id || '',
            employeeName: emp ? emp.name : (item.employeeName || item.employee_name || `Employee #${empId || 'Unknown'}`),
            avatar: emp ? (emp.avatar as string) : (item.avatar || ''),
            category: item.category || 'Other',
            date: item.date || '',
            amount: Number(item.amount || 0),
            status: item.status || 'Pending',
            description: item.description || ''
          };
        });
        setClaims(formatted);
      } catch (err) {
        console.error('Failed to load expense claims:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployeesAndClaims();
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved': return styles.approved;
      case 'Pending': return styles.pending;
      case 'Rejected': return styles.rejected;
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={14} />;
      case 'Pending': return <AlertCircle size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      default: return null;
    }
  };

  const filteredExpenses = claims.filter(exp =>
    exp.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    exp.category.toLowerCase().includes(search.toLowerCase())
  );

  // Compute calculated values
  const totalClaimed = claims.reduce((sum, item) => sum + item.amount, 0);
  const totalApproved = claims.reduce((sum, item) => item.status === 'Approved' ? sum + item.amount : sum, 0);
  const totalPending = claims.reduce((sum, item) => item.status === 'Pending' ? sum + item.amount : sum, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Expense Claims</h1>

      {/* Financial Matrix Summary Dashboard Widgets */}
      <div className={styles.summaryRow}>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconGrey}`}><Wallet size={20} /></div>
          <div><h4>${totalClaimed.toFixed(2)}</h4><p>Total Logged Claims</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconGreen}`}><DollarSign size={20} /></div>
          <div><h4>${totalApproved.toFixed(2)}</h4><p>Total Approved & Paid</p></div>
        </div>
        <div className={styles.widget}>
          <div className={`${styles.widgetIcon} ${styles.iconYellow}`}><FileText size={20} /></div>
          <div><h4>${totalPending.toFixed(2)}</h4><p>Total Pending Review</p></div>
        </div>
      </div>

      {/* Toolbar Control Block */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search employee or category..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.primaryBtn} onClick={() => setIsDrawerOpen(true)}>
          <Plus size={18} /> New Claim
        </button>
      </div>

      {/* Overtime Ledger Table Sheet */}
      <div className={styles.tableWrapper}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading expense claims...</div>
        ) : filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No expense claims found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((claim) => (
                <tr key={claim.id}>
                  <td>#{claim.id}</td>
                  <td>
                    <div className={styles.employeeCell}>
                      {claim.avatar ? (
                        <img src={claim.avatar} alt={claim.employeeName} className={styles.avatar} />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 font-semibold text-xs mr-3">
                          <User size={14} />
                        </div>
                      )}
                      <span className={styles.name}>{claim.employeeName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryText}>{claim.category}</span>
                  </td>
                  <td>{claim.date}</td>
                  <td className={styles.amountCell}>${claim.amount.toFixed(2)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      <span style={{ marginLeft: '6px' }}>{claim.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ExpenseForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onClaimSuccess={fetchClaims} 
      />
    </div>
  );
}