// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import React, { useState } from 'react';
import SlideOverDrawer from '../../../components/common/SlideOverDrawer';
import styles from '../../../components/forms/FormStyles.module.css';
import tabStyles from '../tabs/Tabs.module.css';
import type { WeeklyOffRule } from '../types';

// ==========================================
// 2. TYPES & PROPS
// ==========================================
interface WeeklyOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<WeeklyOffRule, 'id'>) => void;
}

// Ordered weekdays array for toggle mappings
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ==========================================
// 3. MAIN WEEKLY OFF MODAL COMPONENT
// ==========================================
export default function WeeklyOffModal({ isOpen, onClose, onSave }: WeeklyOffModalProps) {
  const [ruleName, setRuleName] = useState('');
  const [patternType, setPatternType] = useState('Fixed (Every Week)');
  const [applicableScope, setApplicableScope] = useState('Company Wide');
  const [activeDays, setActiveDays] = useState<string[]>(['Sun', 'Sat']); // Default weekend

  const toggleDay = (day: string) => {
    setActiveDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName) {
      alert('Please fill in the rule name.');
      return;
    }
    if (activeDays.length === 0) {
      alert('Please select at least one rest day.');
      return;
    }
    onSave({
      rule_name: ruleName,
      pattern_type: patternType,
      applicable_scope: applicableScope,
      active_days: activeDays,
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
        Save Rule
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Weekly Off Rule"
      subtitle="Define weekly rest days and applicable department/roles scopes"
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Section: RULE CONFIGURATION */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Rule Parameters</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Rule Name *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Standard Weekend / Support Offs"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Pattern Type *</label>
          <select
            className={styles.select}
            value={patternType}
            onChange={(e) => setPatternType(e.target.value)}
            required
          >
            <option value="Fixed (Every Week)">Fixed (Every Week)</option>
            <option value="Alternate Weeks (Even)">Alternate Weeks (Even)</option>
            <option value="Alternate Weeks (Odd)">Alternate Weeks (Odd)</option>
            <option value="First Week Only">First Week Only</option>
            <option value="Last Week Only">Last Week Only</option>
          </select>
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
            <option value="Department Specific">Department Specific</option>
            <option value="Role Specific">Role Specific</option>
            <option value="Individual Specific">Individual Specific</option>
          </select>
        </div>

        {/* Section: WEEKDAYS TOGGLES */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Select Weekdays *</span>
        </div>
        
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px 0' }}>
          Select the days of the week designated as rest days:
        </p>

        <div className={tabStyles.weekdaySelector}>
          {WEEKDAYS.map(day => {
            const isActive = activeDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                className={`${tabStyles.dayToggleBtn} ${isActive ? tabStyles.dayToggleActive : ''}`}
                onClick={() => toggleDay(day)}
                title={`Toggle ${day}`}
              >
                {day[0]}
              </button>
            );
          })}
        </div>

      </form>
    </SlideOverDrawer>
  );
}
