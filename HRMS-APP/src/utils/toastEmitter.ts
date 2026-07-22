// ==========================================
// TOAST EMITTER — tiny pub/sub event bus
// ==========================================
// Allows non-React code (e.g. axiosInstance interceptors) to fire toast
// notifications without importing React hooks.
// ToastContext subscribes to this emitter on mount.

export type ToastEventType = 'success' | 'error' | 'warning' | 'info';

export interface ToastEvent {
  message: string;
  type: ToastEventType;
  duration?: number; // ms — defaults to 4000
}

type ToastListener = (event: ToastEvent) => void;

const listeners: ToastListener[] = [];

export const toastEmitter = {
  /** Fired by non-React code (axios interceptors, etc.) */
  emit(event: ToastEvent): void {
    listeners.forEach((fn) => fn(event));
  },

  /** Called by ToastContext on mount to wire itself up. */
  subscribe(fn: ToastListener): () => void {
    listeners.push(fn);
    // Returns unsubscribe function
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },
};
