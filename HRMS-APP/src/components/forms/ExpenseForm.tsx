// # ---> NEW: ExpenseForm Component
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import { expenseApi } from '../../apis/finance/expenseApi';
import { useToast } from '../../contexts/ToastContext';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: () => void;
}

export default function ExpenseForm({ isOpen, onClose, onClaimSuccess }: ExpenseFormProps) {
  const { showToast } = useToast();
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Travel' | 'Meals' | 'Supplies' | 'Other'>('Travel');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !amount || !description.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid positive claim amount.', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      employee: Number(localStorage.getItem('user_id') || 1),
      date,
      amount: amountNum,
      category,
      description: description.trim(),
      status: 'Pending'
    };

    expenseApi.submitExpense(payload)
      .then(() => {
        showToast('Expense claim submitted successfully!', 'success');
        setIsSubmitting(false);
        // Clear fields
        setDate('');
        setAmount('');
        setCategory('Travel');
        setDescription('');
        onClaimSuccess();
        onClose();
      })
      .catch(err => {
        console.error('Failed to submit expense claim:', err);
        showToast('Failed to submit claim. Please try again.', 'error');
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
        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT CLAIM'}
      </button>
    </div>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="New Expense Claim"
      subtitle="Submit a new reimbursement request"
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

        {/* Amount Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Amount ($) *</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
          />
        </div>

        {/* Category Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Category *</label>
          <select
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            required
            title="Category"
            aria-label="Category"
          >
            <option value="Travel">Travel</option>
            <option value="Meals">Meals</option>
            <option value="Supplies">Supplies</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Description *</label>
          <input
            type="text"
            placeholder="e.g. Flight to conference, client lunch details"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </form>
    </SlideOverDrawer>
  );
}
