// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import React, { useState } from 'react';
import SlideOverDrawer from '../../../components/common/SlideOverDrawer';
import styles from '../../../components/forms/FormStyles.module.css';
import type { Holiday } from '../types';

// ==========================================
// 2. TYPES & PROPS
// ==========================================
interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Holiday, 'id'>) => void;
}

// ==========================================
// 3. MAIN HOLIDAY MODAL COMPONENT
// ==========================================
export default function HolidayModal({ isOpen, onClose, onSave }: HolidayModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [applicableScope, setApplicableScope] = useState('Company Wide');
  const [isOptional, setIsOptional] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave({
      name,
      date,
      applicable_scope: applicableScope,
      is_optional: isOptional,
    });
  };

  const footerActions = (
    <>
      <button 
        type="button" 
        className={styles.discardBtn} 
        onClick={onClose}
      >
        Cancel
      </button>
      <button 
        type="button" 
        className={styles.saveBtn} 
        onClick={handleSubmit}
      >
        Save Holiday
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add Calendar Holiday"
      subtitle="Register statutory or optional rest days"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Section: HOLIDAY DETAILS */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Holiday Parameters</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Holiday Name *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Christmas / New Year / National Day"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

        <div className={styles.formGroup}>
          <label className={styles.label}>Applicable Scope *</label>
          <select
            className={styles.select}
            value={applicableScope}
            onChange={(e) => setApplicableScope(e.target.value)}
            required
          >
            <option value="Company Wide">Company Wide</option>
            <option value="Regional Office Only">Regional Office Only</option>
            <option value="Department Specific">Department Specific</option>
          </select>
        </div>

        <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <input
            type="checkbox"
            id="isOptional"
            checked={isOptional}
            onChange={(e) => setIsOptional(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="isOptional" className={styles.label} style={{ margin: 0, cursor: 'pointer' }}>
            Optional Holiday (Restricted Leave)
          </label>
        </div>

      </form>
    </SlideOverDrawer>
  );
}
