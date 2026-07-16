// # ---> NEW: LogOvertimeForm Component
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import { overtimeApi } from '../../apis/operations/overtimeApi';
import { useToast } from '../../contexts/ToastContext';

interface LogOvertimeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLogSuccess: () => void;
}

export default function LogOvertimeForm({ isOpen, onClose, onLogSuccess }: LogOvertimeFormProps) {
  const { showToast } = useToast();
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !hours || !reason.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const hoursNum = Number(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      showToast('Please enter a valid duration of hours.', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      employee: Number(localStorage.getItem('user_id') || 1),
      date,
      hours: hoursNum,
      reason: reason.trim(),
      status: 'Pending'
    };

    overtimeApi.logOvertime(payload)
      .then(() => {
        showToast('Overtime logged successfully!', 'success');
        setIsSubmitting(false);
        // Clear fields
        setDate('');
        setHours('');
        setReason('');
        onLogSuccess();
        onClose();
      })
      .catch(err => {
        console.error('Failed to log overtime:', err);
        showToast('Failed to log overtime. Please try again.', 'error');
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
        {isSubmitting ? 'SAVING...' : 'SAVE LOG'}
      </button>
    </div>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Log Overtime"
      subtitle="Record extra hours worked"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-1">
        {/* Date Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Date *</label>
          <input
            type="date"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Hours Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Hours *</label>
          <input
            type="number"
            step="0.5"
            placeholder="e.g. 2.5"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
            min="0.1"
          />
        </div>

        {/* Reason Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Reason *</label>
          <input
            type="text"
            placeholder="e.g. Server maintenance, end of month reconciliation"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
      </form>
    </SlideOverDrawer>
  );
}
