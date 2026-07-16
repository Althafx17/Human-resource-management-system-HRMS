// # ---> NEW: ExpenseDashboard Component
import React, { useState, useEffect } from 'react';
import { Plus, Receipt, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { expenseApi, ExpenseClaim } from '../../apis/finance/expenseApi';
import ExpenseForm from '../../components/forms/ExpenseForm';

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState<ExpenseClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchClaims = () => {
    setIsLoading(true);
    expenseApi.getExpenses()
      .then(data => {
        setExpenses(data || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load expenses history:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-150';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-150';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-150';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 size={13} />;
      case 'Rejected':
        return <XCircle size={13} />;
      default:
        return <AlertCircle size={13} />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expense Reimbursement</h1>
          <p className="text-sm text-gray-500">Submit and track your company expense claims</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors text-sm"
        >
          <Plus size={16} /> New Claim
        </button>
      </div>

      {/* Analytics KPI Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-150 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Claimed</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              ${expenses
                .reduce((sum, r) => sum + Number(r.amount || 0), 0)
                .toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-150 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Awaiting Decision</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {expenses.filter(r => r.status === 'Pending').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-150 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Approved Claims</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {expenses.filter(r => r.status === 'Approved').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Loading claims record history...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No expense claims logged yet.</p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-1"
            >
              Submit your first reimbursement claim &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-150 uppercase">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {expenses.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{record.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{record.date}</td>
                    <td className="px-6 py-4 font-medium">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">${Number(record.amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600 italic">"{record.description}"</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(record.status)}`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out Claim Submission Form Drawer */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onClaimSuccess={fetchClaims}
      />
    </div>
  );
}
