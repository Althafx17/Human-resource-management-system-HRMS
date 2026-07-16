import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import SlideOverDrawer from '../common/SlideOverDrawer';
import styles from './FormStyles.module.css';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const CATEGORIES = ['Travel', 'Equipment', 'Meals', 'Software'];

export default function ExpenseForm({ isOpen, onClose, onSave }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Travel');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount.trim()) {
      setValidationError('Please fill out this field');
      return;
    }
    
    // Clear validation error if filled
    setValidationError(null);

    if (!date || !category) {
      alert('Please fill in all required fields.');
      return;
    }

    if (onSave) {
      onSave({
        amount: parseFloat(amount),
        date,
        category,
        notes,
      });
    }
    
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (e.target.value.trim() && validationError) {
      setValidationError(null);
    }
  };

  const footerActions = (
    <>
      <button 
        type="button" 
        className={styles.discardBtn} 
        onClick={onClose}
      >
        Discard
      </button>
      <button 
        type="button" 
        className={styles.saveBtn} 
        onClick={handleSubmit}
      >
        Submit Claim
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="New Expense Claim"
      subtitle="Log and claim business-related expenses"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Amount & Date side-by-side */}
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Amount ($) *</label>
            <div className={styles.errorContainer}>
              <input
                type="number"
                step="0.01"
                className={`${styles.input} ${validationError ? styles.errorInput : ''}`}
                placeholder="e.g. 45.00"
                value={amount}
                onChange={handleAmountChange}
              />
              {validationError && (
                <div className={styles.errorTooltip}>
                  <AlertTriangle size={14} color="#ffffff" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Date *</label>
            <input
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Category *</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Textarea */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Notes</label>
          <textarea
            className={styles.textarea}
            placeholder="Describe the purpose of this expense..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

      </form>
    </SlideOverDrawer>
  );
}
