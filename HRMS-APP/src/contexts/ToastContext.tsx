import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { toastEmitter, type ToastEventType } from '../utils/toastEmitter';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

/** Extended to include 'warning' and 'info'. Backward-compatible with original 'success'|'error'. */
export type ToastType = ToastEventType; // 'success' | 'error' | 'warning' | 'info'

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  action?: ToastAction;
}

interface ToastContextType {
  /**
   * Show a toast notification.
   * Original API preserved: showToast(message, type?)
   * Extended API: showToast(message, type?, options?)
   */
  showToast: (
    message: string,
    type?: ToastType,
    options?: { duration?: number; action?: ToastAction }
  ) => void;
}

// ==========================================
// CONTEXT
// ==========================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

// ==========================================
// VISUAL CONFIG
// ==========================================

const config: Record<ToastType, { bg: string; border: string; icon: React.ElementType }> = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle },
  error:   { bg: '#fef2f2', border: '#fecaca', icon: XCircle },
  warning: { bg: '#fffbeb', border: '#fde68a', icon: AlertTriangle },
  info:    { bg: '#eff6ff', border: '#bfdbfe', icon: Info },
};

const iconColor: Record<ToastType, string> = {
  success: '#16a34a',
  error:   '#dc2626',
  warning: '#d97706',
  info:    '#2563eb',
};

// ==========================================
// PROVIDER
// ==========================================

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'success',
      options?: { duration?: number; action?: ToastAction }
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      const duration = options?.duration ?? 4000;
      setToasts((prev) => [...prev, { id, message, type, duration, action: options?.action }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Subscribe to the toastEmitter so axiosInstance interceptors can fire toasts
  useEffect(() => {
    const unsubscribe = toastEmitter.subscribe((event) => {
      showToast(event.message, event.type, { duration: event.duration });
    });
    return unsubscribe;
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Portal */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
          minWidth: '300px',
          maxWidth: '400px',
        }}
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => {
          const { bg, border, icon: Icon } = config[toast.type];
          const color = iconColor[toast.type];
          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                padding: '14px 16px',
                borderRadius: '12px',
                background: bg,
                border: `1.5px solid ${border}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                animation: 'toastSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
              role="alert"
            >
              <style>{`
                @keyframes toastSlideIn {
                  from { transform: translateX(110%); opacity: 0; }
                  to   { transform: translateX(0);    opacity: 1; }
                }
              `}</style>

              <Icon size={18} color={color} style={{ flexShrink: 0, marginTop: '1px' }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b', lineHeight: 1.5 }}>
                  {toast.message}
                </span>
                {toast.action && (
                  <button
                    type="button"
                    onClick={toast.action.onClick}
                    style={{
                      display: 'block',
                      marginTop: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0 0 0 4px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
