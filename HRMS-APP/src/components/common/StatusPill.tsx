import styles from './StatusPill.module.css';

// ==========================================
// STATUS PILL
// ==========================================
// Maps status strings used across the app to colored pill badges.
// Add new statuses to the `statusConfig` map as modules grow.
//
// Usage:
//   <StatusPill status="Present" />
//   <StatusPill status="Approved" size="sm" />

export type StatusValue =
  // Attendance
  | 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave'
  // Leave / Overtime / Expense / Shift Swap
  | 'Approved' | 'Pending' | 'Rejected' | 'Cancelled'
  // Employee
  | 'Active' | 'Inactive' | 'Probation' | 'Terminated'
  // Payroll
  | 'Paid' | 'Unpaid' | 'Processing'
  // Help Desk
  | 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  // Generic fallback
  | (string & Record<never, never>);

type PillSize = 'sm' | 'md';

interface StatusPillProps {
  status: StatusValue;
  size?: PillSize;
  className?: string;
}

type Variant = 'green' | 'red' | 'amber' | 'blue' | 'slate' | 'violet' | 'indigo';

const variantMap: Record<string, Variant> = {
  // Green
  Present: 'green', Approved: 'green', Active: 'green', Paid: 'green', Resolved: 'green', Closed: 'slate',
  // Red
  Absent: 'red', Rejected: 'red', Terminated: 'red', Unpaid: 'red',
  // Amber
  Late: 'amber', Pending: 'amber', Processing: 'amber', Probation: 'amber', 'Half Day': 'amber',
  // Blue
  'On Leave': 'blue', 'In Progress': 'blue',
  // Slate
  Inactive: 'slate', Cancelled: 'slate',
  // Violet / Indigo fallback
  Open: 'indigo',
};

const variantStyles: Record<Variant, { bg: string; color: string; dot: string }> = {
  green:  { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  red:    { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
  amber:  { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' },
  blue:   { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  slate:  { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  violet: { bg: '#faf5ff', color: '#7c3aed', dot: '#a78bfa' },
  indigo: { bg: '#eef2ff', color: '#4338ca', dot: '#6366f1' },
};

export default function StatusPill({ status, size = 'md', className }: StatusPillProps) {
  const variant = variantMap[status] ?? 'slate';
  const { bg, color, dot } = variantStyles[variant];

  return (
    <span
      className={`${styles.pill} ${size === 'sm' ? styles.sm : ''} ${className ?? ''}`}
      style={{ background: bg, color }}
      aria-label={`Status: ${status}`}
    >
      <span
        className={styles.dot}
        style={{ background: dot }}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
