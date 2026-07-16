// # ---> NEW: ExpenseApprovalDashboard Component
import React, { useState, useEffect } from 'react';
import { Check, X, ShieldAlert, User, Calendar, Receipt } from 'lucide-react';
import { expenseApi, ExpenseClaim } from '../../apis/finance/expenseApi';
import { employeeApi } from '../../apis/core/employeeApi';
import { useToast } from '../../contexts/ToastContext';
import type { EmployeeData } from '../employees/types';

export default function ExpenseApprovalDashboard() {
  const { showToast } = useToast();
  const [pendingClaims, setPendingClaims] = useState<any[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, EmployeeData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isActioningId, setIsActioningId] = useState<string | number | null>(null);

  // Fetch employees lookup map and pending claims
  useEffect(() => {
    const loadLookupsAndClaims = async () => {
      setIsLoading(true);
      try {
        // Load employees to build names cache
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

        // Fetch pending claims
        const claims = await expenseApi.getPendingExpenses();
        setPendingClaims(claims || []);
      } catch (err) {
        console.error('Failed to load pending expenses dashboard:', err);
        showToast('Error loading pending expense claims.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadLookupsAndClaims();
  }, []);

  const handleStatusUpdate = (id: string | number, newStatus: 'Approved' | 'Rejected') => {
    setIsActioningId(id);
    expenseApi.updateExpenseStatus(id, newStatus)
      .then(() => {
        showToast(`Expense claim ${newStatus.toLowerCase()} successfully!`, 'success');
        setPendingClaims(prev => prev.filter(claim => claim.id !== id));
      })
      .catch(err => {
        console.error(`Failed to update expense ID ${id}:`, err);
        showToast('Failed to update status. Please try again.', 'error');
      })
      .finally(() => {
        setIsActioningId(null);
      });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Block */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl border border-yellow-100">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending Expense Claims</h1>
          <p className="text-sm text-gray-500">Review and action employee reimbursement requests</p>
        </div>
      </div>

      {/* Grid List of pending cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading pending requests...</p>
        </div>
      ) : pendingClaims.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center shadow-sm">
          <p className="text-gray-500 text-sm">No pending expense claims to approve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pendingClaims.map((claim) => {
            const empId = String(claim.employee);
            const emp = employeeMap[empId];
            const empName = emp ? emp.name : `Employee #${claim.employee || 'Unknown'}`;
            const empAvatar = emp ? emp.avatar : '';

            return (
              <div key={claim.id} className="bg-white rounded-xl shadow-sm border border-gray-150 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {/* Card Header: Profile Info */}
                  <div className="flex items-center gap-3 mb-4">
                    {empAvatar && typeof empAvatar === 'string' ? (
                      <img 
                        src={empAvatar} 
                        alt={empName} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 font-semibold text-sm">
                        <User size={18} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{empName}</h4>
                      <p className="text-xs text-gray-400">Claim ID: #{claim.id}</p>
                    </div>
                  </div>

                  {/* Category and Date row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {claim.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={13} />
                      <span>{claim.date}</span>
                    </div>
                  </div>

                  {/* Amount Display */}
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt size={14} className="text-gray-400" />
                    <span className="text-base font-bold text-gray-800">
                      ${Number(claim.amount || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 mb-4 line-clamp-3 italic">
                    "{claim.description || 'No description provided'}"
                  </p>
                </div>

                {/* Approve/Reject Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(claim.id, 'Rejected')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                    disabled={isActioningId === claim.id}
                  >
                    <X size={14} />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(claim.id, 'Approved')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    disabled={isActioningId === claim.id}
                  >
                    <Check size={14} />
                    Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
