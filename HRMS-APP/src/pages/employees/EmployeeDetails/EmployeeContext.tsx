// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { EmployeeData } from '../types';
import { employeeApi } from '../../../apis/core/employeeApi';

// ==========================================
// 2. TYPES & INTERFACES
// ==========================================

/**
 * Context type interface for Employee details context provider.
 */
interface EmployeeContextType {
  /** The current loaded employee profile data. */
  employee: EmployeeData | null;
  /** True if the data is currently loading from the API. */
  isLoading: boolean;
  /** Contains the error message if the API fetch fails, otherwise null. */
  error: string | null;
  /** Refetches the employee details from the backend. */
  refreshEmployee: () => Promise<void>;
  /** Update the local employee details state directly (e.g. for editing updates). */
  setEmployee: React.Dispatch<React.SetStateAction<EmployeeData | null>>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

// ==========================================
// 3. MAIN PROVIDER COMPONENT & HOOK
// ==========================================

/**
 * EmployeeProvider Component
 * 
 * Provides employee profile data, loading states, and update triggers.
 * Resolves redundant API fetches across the EmployeeDetails page subtabs.
 * 
 * @param {string} employeeId - Unique database ID of the employee.
 * @param {ReactNode} children - Child elements wrapped by the provider.
 */
export const EmployeeProvider: React.FC<{ employeeId: string; children: ReactNode }> = ({ employeeId, children }) => {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches employee profile from the API using the database ID.
   */
  const fetchEmployee = async () => {
    setIsLoading(true);
    try {
      const data = await employeeApi.getById(employeeId);
      setEmployee(data);
      setError(null);
    } catch (err: any) {
      console.error('Context fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch employee details');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch employee data whenever the ID changes
  useEffect(() => {
    let active = true;
    if (employeeId) {
      Promise.resolve().then(() => {
        if (active) {
          fetchEmployee();
        }
      });
    }
    return () => {
      active = false;
    };
  }, [employeeId]);

  return (
    <EmployeeContext.Provider value={{ employee, isLoading, error, refreshEmployee: fetchEmployee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

/**
 * Custom hook to consume the EmployeeContext.
 * Throws an error if used outside an EmployeeProvider.
 * 
 * @returns {EmployeeContextType} Loaded context values.
 */
export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};
