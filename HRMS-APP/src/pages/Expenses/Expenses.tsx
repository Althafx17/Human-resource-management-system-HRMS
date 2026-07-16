import { useState } from 'react';
import { Search, Plus, FileText, DollarSign, Wallet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from './Expenses.module.css';

import ExpenseForm from '../../components/forms/ExpenseForm';

interface ExpenseClaim {
  id: string;
  employeeName: string;
  avatar: string;
  category: 'Travel' | 'Equipment' | 'Meals' | 'Software';
  date: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const DUMMY_EXPENSES: ExpenseClaim[] = [
  { id: 'EXP-101', employeeName: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1', category: 'Software', date: '2026-06-12', amount: 49.00, status: 'Approved' },
  { id: 'EXP-102', employeeName: 'Sara John', avatar: 'https://i.pravatar.cc/150?u=2', category: 'Travel', date: '2026-06-15', amount: 320.50, status: 'Pending' },
  { id: 'EXP-103', employeeName: 'Anmariya', avatar: 'https://i.pravatar.cc/150?u=4', category: 'Meals', date: '2026-06-16', amount: 45.80, status: 'Approved' },
  { id: 'EXP-104', employeeName: 'Angel Philip', avatar: 'https://i.pravatar.cc/150?u=3', category: 'Equipment', date: '2026-06-10', amount: 1200.00, status: 'Rejected' },
];

export default function Expenses() {
  const [search, setSearch] = useState('');
  const [claims, setClaims] = useState<ExpenseClaim[]>(DUMMY_EXPENSES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleSave = (data: any) => {
    const newClaim: ExpenseClaim = {
      id: `EXP-${101 + claims.length}`,
      employeeName: 'Admin (You)',
      avatar: 'https://i.pravatar.cc/150?u=99',
      category: data.category as any,
      date: data.date,
      amount: data.amount,
      status: 'Pending',
    };
    setClaims(prev => [newClaim, ...prev]);
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

      {/* Filter and Input Toolbar Group */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search claims or category..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          className={styles.primaryBtn}
          onClick={() => setIsDrawerOpen(true)}
        >
          <Plus size={18} /> New Claim
        </button>
      </div>

      {/* Claims Records Data Sheet */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>
                  <div className={styles.employeeCell}>
                    <img src={claim.avatar} alt={claim.employeeName} className={styles.avatar} />
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
      </div>

      <ExpenseForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}