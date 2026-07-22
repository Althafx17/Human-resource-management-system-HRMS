import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

// ==========================================
// PAGINATION
// ==========================================
// Usage:
//   <Pagination
//     totalCount={152}
//     pageSize={20}
//     currentPage={3}
//     onPageChange={setPage}
//   />

interface PaginationProps {
  /** Total number of records (from API `count` field). */
  totalCount: number;
  /** Records per page. */
  pageSize: number;
  /** Current 1-based page number. */
  currentPage: number;
  /** Called with the new page number when user navigates. */
  onPageChange: (page: number) => void;
  /** Called with the new page size when user changes it. Omit to hide page-size selector. */
  onPageSizeChange?: (size: number) => void;
  /** Available page size options. Defaults to [10, 20, 50]. */
  pageSizeOptions?: number[];
  /** Optional extra class on outer wrapper. */
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export default function Pagination({
  totalCount,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const to = Math.min(currentPage * pageSize, totalCount);
  const pages = getPageNumbers(currentPage, totalPages);

  if (totalCount === 0) return null;

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`} aria-label="Pagination">
      <span className={styles.info}>
        Showing <strong>{from}–{to}</strong> of <strong>{totalCount}</strong> results
      </span>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`${styles.btn} ${p === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {onPageSizeChange && (
        <select
          className={styles.pageSizeSelect}
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // Reset to first page on size change
          }}
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>{s} per page</option>
          ))}
        </select>
      )}
    </div>
  );
}
