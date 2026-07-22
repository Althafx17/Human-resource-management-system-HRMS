import { type ReactNode, type ElementType } from 'react';
import styles from './EmptyState.module.css';

// ==========================================
// EMPTY STATE
// ==========================================
// Replace every "No records found." text with this component.
//
// Example:
//   <EmptyState
//     icon={UsersIcon}
//     heading="No employees found"
//     body="Add your first employee to get started."
//     primaryAction={{ label: 'Add Employee', onClick: () => navigate('/employees/add') }}
//   />

interface ActionProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface EmptyStateProps {
  /** Lucide icon component or any SVG element. */
  icon?: ElementType;
  /** Icon size in px. Defaults to 48. */
  iconSize?: number;
  /** Bold heading line. */
  heading: string;
  /** Explanatory paragraph below the heading. */
  body?: string;
  /** Primary CTA button. */
  primaryAction?: ActionProps;
  /** Optional secondary CTA button. */
  secondaryAction?: ActionProps;
  /** Optional extra class for the outer wrapper. */
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  iconSize = 48,
  heading,
  body,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`} role="status" aria-live="polite">
      {Icon && (
        <div className={styles.illustration} aria-hidden="true">
          <Icon size={iconSize} />
        </div>
      )}

      <h3 className={styles.heading}>{heading}</h3>
      {body && <p className={styles.body}>{body}</p>}

      {(primaryAction || secondaryAction) && (
        <div className={styles.actions}>
          {primaryAction && (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={primaryAction.onClick}
            >
              {primaryAction.icon}
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
