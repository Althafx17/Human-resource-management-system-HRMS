// ---> NEW: Dedicated Employee Self-Service Expenses Page
import { useState, useEffect } from 'react';
import { Receipt, Plus, DollarSign, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';
import { expenseApi } from '../../apis/finance/expenseApi';
import type { ExpenseClaim } from '../../apis/finance/expenseApi';
import ExpenseForm from '../../components/forms/ExpenseForm';
import { useToast } from '../../contexts/ToastContext';

export default function MyExpenses() {
  const { showToast } = useToast();
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const data = await expenseApi.getExpenses();
      setClaims(data);
    } catch (err) {
      console.error('Failed to fetch expense claims:', err);
      showToast('Failed to load expenses.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const totalAmount = claims.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const approvedAmount = claims
    .filter((c) => c.status === 'Approved')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const pendingCount = claims.filter((c) => c.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Expenses</h1>
          <p className="text-sm text-slate-500">Submit and track your expense reimbursement claims.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span>Submit Expense</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Claimed</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Reimbursement</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">${approvedAmount.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount} Claims</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Claims Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Receipt size={18} className="text-blue-500" />
            <span>Submitted Claims History</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">{claims.length} Records</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <Clock className="animate-spin text-blue-500" size={24} />
            <p className="text-sm font-medium">Loading claims records...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Receipt size={36} className="mx-auto mb-2 opacity-40 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No expense claims found.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Submit Expense" to request a reimbursement.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{claim.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{claim.category}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${Number(claim.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{claim.description}</td>
                    <td className="px-6 py-4">
                      {claim.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={13} /> Approved
                        </span>
                      )}
                      {claim.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle size={13} /> Pending
                        </span>
                      )}
                      {claim.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle size={13} /> Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense Form Drawer Component */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onClaimSuccess={fetchClaims}
      />
    </div>
  );
}
