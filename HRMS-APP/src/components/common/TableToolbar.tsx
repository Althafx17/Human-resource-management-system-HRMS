import { useRef, useEffect, type ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import styles from './TableToolbar.module.css';

// ==========================================
// TABLE TOOLBAR
// ==========================================
// Standardized toolbar for every list/table view.
// Provides: debounced search, filter chips, action button slots.
//
// Usage:
//   <TableToolbar
//     searchValue={search}
//     onSearchChange={setSearch}
//     searchPlaceholder="Search employees…"
//     filters={[
//       { label: 'All', value: 'all' },
//       { label: 'Active', value: 'active' },
//     ]}
//     activeFilter={filter}
//     onFilterChange={setFilter}
//     actions={<button onClick={...}>+ Add</button>}
//   />

interface FilterOption {
  label: string;
  value: string;
}

interface TableToolbarProps {
  /** Controlled search value. */
  searchValue: string;
  /** Called with new value after debounce (300ms). */
  onSearchChange: (value: string) => void;
  /** Placeholder text for search input. */
  searchPlaceholder?: string;
  /** Debounce delay in ms. Defaults to 300. */
  debounceMs?: number;
  /** Filter chip options. */
  filters?: FilterOption[];
  /** Currently active filter value. */
  activeFilter?: string;
  /** Called when a filter chip is clicked. */
  onFilterChange?: (value: string) => void;
  /** Slot for action buttons (e.g. "+ Add Employee"). Rendered right-aligned. */
  actions?: ReactNode;
  /** Extra class on the outer wrapper. */
  className?: string;
}

export default function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  debounceMs = 300,
  filters,
  activeFilter,
  onFilterChange,
  actions,
  className,
}: TableToolbarProps) {
  // Local input state to debounce the onChange call
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep input value in sync if parent resets searchValue to ''
  useEffect(() => {
    if (searchValue === '' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [searchValue]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearchChange(raw), debounceMs);
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = '';
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearchChange('');
  }

  return (
    <div className={`${styles.toolbar} ${className ?? ''}`} role="toolbar" aria-label="Table controls">
      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="search"
          className={styles.searchInput}
          defaultValue={searchValue}
          onChange={handleInputChange}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
        {searchValue && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      {filters && filters.length > 0 && (
        <div className={styles.filters} role="group" aria-label="Filters">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`${styles.filterChip} ${activeFilter === f.value ? styles.active : ''}`}
              onClick={() => onFilterChange?.(f.value)}
              aria-pressed={activeFilter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Right-side Actions */}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
