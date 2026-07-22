import styles from './SkeletonLoader.module.css';

// ==========================================
// SKELETON LOADER
// ==========================================
// Variant    | Use when
// -----------|------------------------------------------
// 'rows'     | Text lists, form fields, simple content
// 'cards'    | Employee cards, leave cards, shift cards
// 'stat'     | Dashboard stat cards
// 'table'    | Table body rows (Employees, Attendance…)

export type SkeletonVariant = 'rows' | 'cards' | 'stat' | 'table';

interface SkeletonLoaderProps {
  /** Number of repeated skeleton units to render. */
  count?: number;
  /** Visual variant of the skeleton. Defaults to 'rows'. */
  variant?: SkeletonVariant;
  /** Extra wrapper className for layout overrides. */
  className?: string;
}

export default function SkeletonLoader({
  count = 4,
  variant = 'rows',
  className,
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  if (variant === 'rows') {
    return (
      <div className={className} role="status" aria-label="Loading…">
        {items.map((_, i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${styles.row}`}
            style={{ width: `${70 + (i % 3) * 10}%` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div
        className={className}
        role="status"
        aria-label="Loading…"
        style={{ display: 'grid', gap: '16px' }}
      >
        {items.map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={`${styles.skeleton} ${styles.cardAvatar}`} />
              <div className={styles.cardTitle}>
                <div className={`${styles.skeleton} ${styles.cardTitleLine}`} />
                <div className={`${styles.skeleton} ${styles.cardSubLine}`} />
              </div>
            </div>
            <div className={`${styles.skeleton} ${styles.row}`} style={{ width: '90%' }} />
            <div className={`${styles.skeleton} ${styles.row}`} style={{ width: '60%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div
        className={className}
        role="status"
        aria-label="Loading…"
        style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
      >
        {items.map((_, i) => (
          <div key={i} className={styles.statCard}>
            <div className={`${styles.skeleton} ${styles.statLine1}`} />
            <div className={`${styles.skeleton} ${styles.statLine2}`} />
            <div className={`${styles.skeleton} ${styles.statLine3}`} />
          </div>
        ))}
      </div>
    );
  }

  // variant === 'table'
  return (
    <div className={className} role="status" aria-label="Loading…">
      {items.map((_, i) => (
        <div key={i} className={styles.tableRow}>
          <div
            className={`${styles.skeleton} ${styles.tableRowCell}`}
            style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }}
          />
          <div className={`${styles.skeleton} ${styles.tableRowCell}`} style={{ flex: 2 }} />
          <div className={`${styles.skeleton} ${styles.tableRowCell}`} style={{ flex: 1 }} />
          <div className={`${styles.skeleton} ${styles.tableRowCell}`} style={{ flex: 1 }} />
          <div className={`${styles.skeleton} ${styles.tableRowCell}`} style={{ width: '80px' }} />
        </div>
      ))}
    </div>
  );
}
