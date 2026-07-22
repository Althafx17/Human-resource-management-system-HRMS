// # ---> NEW: ApplyLeaveForm Component
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import { leaveApi } from '../../apis/operations/leaveApi';
import { useToast } from '../../contexts/ToastContext';

interface ApplyLeaveFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function ApplyLeaveForm({ isOpen, onClose, onSaveSuccess }: ApplyLeaveFormProps) {
  const { showToast } = useToast();
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    // ---> CHANGED: strictly omit employee key so the backend JWT claims identify the user
    const payload = {
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason.trim(),
      status: 'Pending'
    };

    leaveApi.applyLeave(payload)
      .then(() => {
        showToast('Leave request submitted successfully!', 'success');
        setIsSubmitting(false);
        // Clear fields
        setStartDate('');
        setEndDate('');
        setReason('');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      })
      .catch(err => {
        console.error('Failed to submit leave request:', err);
        showToast('Failed to apply for leave. Please try again.', 'error');
        setIsSubmitting(false);
      });
  };

  const footerActions = (
    <div className="flex gap-3 justify-end w-full">
      <button 
        type="button" 
        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        onClick={onClose}
        disabled={isSubmitting}
      >
        DISCARD
      </button>
      <button 
        type="button" 
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Check size={16} />
        {isSubmitting ? 'SUBMITTING...' : 'APPLY LEAVE'}
      </button>
    </div>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Apply Leave"
      subtitle="Request time off work"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-1">
        {/* Leave Type Select input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Leave Type *</label>
          <select
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
            title="Leave Type"
            aria-label="Leave Type"
          >
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
          </select>
        </div>

        {/* Date Ranges Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Start Date *</label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">End Date *</label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Reason Textarea input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Reason *</label>
          <textarea
            rows={4}
            placeholder="Please detail the reason for your leave request..."
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
      </form>
    </SlideOverDrawer>
  );
}
