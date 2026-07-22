import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { UserRole } from '../apis/auth/loginApi';

// ==========================================
// 1. TYPES
// ==========================================

interface AuthRoleState {
  /** Authenticated user's role. null = not yet resolved or not logged in. */
  role: UserRole | null;
  /** Authenticated user's numeric ID. null = not yet resolved or not logged in. */
  userId: number | null;
  /** True once localStorage has been read (prevents flash of redirect). */
  isResolved: boolean;
  /** True if a valid access token is present. */
  isAuthenticated: boolean;
  /** Call after login to sync state without a page reload. */
  refresh: () => void;
  /** Call on logout to clear state. */
  clear: () => void;
}

// ==========================================
// 2. CONTEXT
// ==========================================

const AuthRoleContext = createContext<AuthRoleState | undefined>(undefined);

// ==========================================
// 3. HELPERS
// ==========================================

function readFromStorage(): Pick<AuthRoleState, 'role' | 'userId' | 'isAuthenticated'> {
  const token = localStorage.getItem('access_token');
  const isAuthenticated =
    !!token && token !== 'undefined' && token !== 'null';

  const rawRole = localStorage.getItem('role') as UserRole | null;
  const validRoles: UserRole[] = ['admin', 'hr', 'manager', 'employee'];
  const role: UserRole | null =
    rawRole && validRoles.includes(rawRole) ? rawRole : null;

  const rawUserId = localStorage.getItem('user_id');
  const userId = rawUserId ? parseInt(rawUserId, 10) : null;

  return { role, userId, isAuthenticated };
}

// ==========================================
// 4. PROVIDER
// ==========================================

export function AuthRoleProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthRoleState, 'refresh' | 'clear'>>({
    role: null,
    userId: null,
    isResolved: false,
    isAuthenticated: false,
  });

  const resolve = useCallback(() => {
    const { role, userId, isAuthenticated } = readFromStorage();
    setState({ role, userId, isAuthenticated, isResolved: true });
  }, []);

  const clear = useCallback(() => {
    setState({ role: null, userId: null, isAuthenticated: false, isResolved: true });
  }, []);

  // Read on mount (synchronous localStorage read is safe before first paint)
  useEffect(() => {
    resolve();
  }, [resolve]);

  return (
    <AuthRoleContext.Provider value={{ ...state, refresh: resolve, clear }}>
      {children}
    </AuthRoleContext.Provider>
  );
}

// ==========================================
// 5. HOOK
// ==========================================

/**
 * Returns the current auth role state.
 * Must be used inside <AuthRoleProvider>.
 */
export function useAuthRole(): AuthRoleState {
  const ctx = useContext(AuthRoleContext);
  if (!ctx) throw new Error('useAuthRole must be used within <AuthRoleProvider>');
  return ctx;
}
