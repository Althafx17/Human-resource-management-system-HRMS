// # ---> NEW: ExpenseForm Component with Employee Selection and Receipt Upload
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import { expenseApi } from '../../apis/finance/expenseApi';
import { employeeApi } from '../../apis/core/employeeApi';
import type { EmployeeData } from '../../pages/employees/types';
import { useToast } from '../../contexts/ToastContext';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: () => void;
}

export default function ExpenseForm({ isOpen, onClose, onClaimSuccess }: ExpenseFormProps) {
  const { showToast } = useToast();
  
  // Form fields states
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Travel' | 'Meals' | 'Supplies' | 'Other'>('Travel');
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees list to build selector options
  useEffect(() => {
    if (isOpen) {
      const loadEmployees = async () => {
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
          setEmployees(allEmployees);
          
          // Default to current active user profile, or first employee in the list
          const activeUserId = localStorage.getItem('user_id');
          if (activeUserId) {
            setSelectedEmployee(activeUserId);
          } else if (allEmployees.length > 0) {
            setSelectedEmployee(String(allEmployees[0].id));
          }
        } catch (err) {
          console.error('Failed to query employees directory:', err);
        }
      };
      loadEmployees();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      showToast('Please select an employee.', 'error');
      return;
    }
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
      employee: Number(selectedEmployee),
      date,
      amount: amountNum,
      category,
      description: description.trim(),
      status: 'Pending',
      receipt: receipt
    };

    expenseApi.submitExpense(payload)
      .then(() => {
        showToast('Expense claim submitted successfully!', 'success');
        setIsSubmitting(false);
        // Reset states
        setDate('');
        setAmount('');
        setCategory('Travel');
        setDescription('');
        setReceipt(null);
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
        {/* Employee Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Employee *</label>
          <select
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
            title="Employee"
            aria-label="Employee"
          >
            <option value="" disabled>-- Choose Employee --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.designation || 'Staff'})
              </option>
            ))}
          </select>
        </div>

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

        {/* Receipt File Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Receipt Attachment</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-shadow cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setReceipt(e.target.files[0]);
              }
            }}
          />
          {receipt && (
            <p className="text-xs text-green-600 mt-1">
              Selected File: {receipt.name} ({(receipt.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      </form>
    </SlideOverDrawer>
  );
}
