// ---> NEW: Dedicated Employee Self-Service Leaves Page
import { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { leaveApi } from '../../apis/operations/leaveApi';
import { useToast } from '../../contexts/ToastContext';

export interface LeaveRequest {
  id: string | number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface LeaveBalanceItem {
  leaveType: string;
  allocated: number;
  available: number;
  color: string;
}

export default function MyLeaves() {
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const balances: LeaveBalanceItem[] = [
    { leaveType: 'Annual Leave', allocated: 15, available: 11, color: 'bg-blue-500' },
    { leaveType: 'Sick Leave', allocated: 8, available: 7, color: 'bg-emerald-500' },
    { leaveType: 'Casual Leave', allocated: 6, available: 4, color: 'bg-purple-500' },
  ];

  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const data = await leaveApi.getAll();
      const formatted: LeaveRequest[] = data.map((item: any) => ({
        id: item.id || item.leave_id || Math.random(),
        type: item.type || item.leave_type || 'Annual Leave',
        startDate: item.startDate || item.start_date || '',
        endDate: item.endDate || item.end_date || '',
        days: Number(item.days || item.leave_days || 1),
        reason: item.reason || item.notes || '',
        status: (item.status as any) || 'Pending',
      }));
      setLeaves(formatted);
    } catch (err) {
      console.error('Failed to load leave records:', err);
      showToast('Failed to load leave history.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
        status: 'Pending',
      };
      await leaveApi.create(payload);
      showToast('Leave request submitted successfully!', 'success');
      setIsModalOpen(false);
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
    } catch (err) {
      console.error('Failed to submit leave request:', err);
      showToast('Failed to submit request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Leaves</h1>
          <p className="text-sm text-slate-500">Track your leave balances and submit time-off requests.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {balances.map((b) => {
          const used = b.allocated - b.available;
          const pct = Math.round((used / b.allocated) * 100);
          return (
            <div key={b.leaveType} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">{b.leaveType}</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {b.available} Days Left
                </span>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-2xl font-extrabold text-slate-900">{b.available}</span>
                  <span className="text-xs text-slate-400">/ {b.allocated} Total Days</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${100 - pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* History Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" />
            <span>Leave Application History</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">{leaves.length} Applications Total</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <Clock className="animate-spin text-blue-500" size={24} />
            <p className="text-sm font-medium">Loading leave records...</p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar size={36} className="mx-auto mb-2 opacity-40 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No leave applications found.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Apply for Leave" to create your first request.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Leave Type</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Total Days</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.type}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {item.startDate} {item.endDate ? `→ ${item.endDate}` : ''}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.days} {item.days === 1 ? 'Day' : 'Days'}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{item.reason || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {item.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={13} /> Approved
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle size={13} /> Pending
                        </span>
                      )}
                      {item.status === 'Rejected' && (
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

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Apply for Leave</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Leave Type *
                </label>
                <select
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity / Paternity Leave">Maternity / Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {calculateDays() > 0 && (
                <div className="bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-lg font-medium">
                  Total Requested Duration: <strong>{calculateDays()} {calculateDays() === 1 ? 'Day' : 'Days'}</strong>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason / Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide a short reason for your leave request..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
