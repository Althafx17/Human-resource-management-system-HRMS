import { AlertTriangle, ShieldOff, ServerCrash, WifiOff, RefreshCw } from 'lucide-react';
import styles from './ErrorBoundaryCard.module.css';

// ==========================================
// ERROR BOUNDARY CARD
// ==========================================
// Maps HTTP status codes to friendly, actionable UI.
// Drop in wherever an API call might fail.
//
// Example:
//   const [error, setError] = useState<number | null>(null);
//   ...
//   if (error) return <ErrorBoundaryCard status={error} onRetry={fetchData} />;

interface ErrorBoundaryCardProps {
  /** HTTP status code that caused the error, or a generic Error object. */
  status?: number;
  /** Override the auto-generated message. */
  message?: string;
  /** Callback for the "Try again" button. Omit to hide the button. */
  onRetry?: () => void;
  /** Extra class for outer wrapper. */
  className?: string;
}

interface ErrorMeta {
  code: string;
  heading: string;
  message: string;
  isForbidden?: boolean;
}

function getMeta(status?: number): ErrorMeta {
  switch (status) {
    case 400:
      return { code: 'Error 400', heading: 'Bad Request', message: 'The server could not process your request. Please check your input and try again.' };
    case 401:
      return { code: 'Error 401', heading: 'Session Expired', message: 'Your session has expired. Please log in again.' };
    case 403:
      return { code: 'Error 403', heading: 'Access Denied', message: 'You don\'t have permission to view this content. Contact your administrator if you think this is a mistake.', isForbidden: true };
    case 404:
      return { code: 'Error 404', heading: 'Not Found', message: 'The resource you\'re looking for doesn\'t exist or may have been removed.' };
    case 409:
      return { code: 'Error 409', heading: 'Conflict', message: 'This record already exists or conflicts with existing data. Please review and try again.' };
    case 422:
      return { code: 'Error 422', heading: 'Validation Failed', message: 'Some fields contain invalid values. Please review your input.' };
    case 429:
      return { code: 'Error 429', heading: 'Too Many Requests', message: 'You\'re doing that too fast. Please wait a moment before trying again.' };
    case 500:
      return { code: 'Error 500', heading: 'Server Error', message: 'Something went wrong on our end. Please try again in a few moments.' };
    case 503:
      return { code: 'Error 503', heading: 'Service Unavailable', message: 'The service is temporarily down for maintenance. Please try again shortly.' };
    default:
      return { code: 'Error', heading: 'Something went wrong', message: 'An unexpected error occurred. Please try again.' };
  }
}

function StatusIcon({ status }: { status?: number }) {
  if (status === 403) return <ShieldOff size={28} />;
  if (status === 503 || status === 0) return <WifiOff size={28} />;
  if (status && status >= 500) return <ServerCrash size={28} />;
  return <AlertTriangle size={28} />;
}

export default function ErrorBoundaryCard({
  status,
  message,
  onRetry,
  className,
}: ErrorBoundaryCardProps) {
  const meta = getMeta(status);

  return (
    <div
      className={`${styles.card} ${className ?? ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${styles.iconWrap} ${meta.isForbidden ? styles.forbidden : ''}`}>
        <StatusIcon status={status} />
      </div>

      <span className={`${styles.status} ${meta.isForbidden ? styles.forbidden : ''}`}>
        {meta.code}
      </span>
      <h3 className={styles.heading}>{meta.heading}</h3>
      <p className={styles.message}>{message ?? meta.message}</p>

      {onRetry && (
        <button type="button" className={styles.retryBtn} onClick={onRetry}>
          <RefreshCw size={15} />
          Try again
        </button>
      )}
    </div>
  );
}
