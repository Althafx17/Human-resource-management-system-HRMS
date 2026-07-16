// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { axiosInstance } from '../config/axiosInstance';

// ==========================================
// 2. SIGNUP API SERVICE
// ==========================================

export const signupApi = {
  /**
   * Phase 1: Sends the user's email to request a new sign-up OTP verification code.
   * 
   * @param email - The email address to send the OTP to.
   * @returns A promise resolving to the backend response message.
   */
  async sendOtp(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>('/users/signup/email/', { email });
    return response.data;
  },

  /**
   * Phase 2: Verifies the OTP entered by the user against the backend cache.
   * 
   * @param email - The email address associated with the OTP.
   * @param otp - The verification code.
   * @returns A promise resolving to the temporary secure cryptographic verification token.
   */
  async verifyOtp(email: string, otp: string): Promise<{ message: string; verification_token: string }> {
    const response = await axiosInstance.post<{ message: string; verification_token: string }>('/users/signup/verify-otp/', { email, otp });
    return response.data;
  },

  /**
   * Phase 3: Sends the password, email, and verification token to finalize user registration.
   * 
   * @param payload - Registration payload containing email, password, and verification_token.
   * @returns A promise resolving to JWT credentials: access and refresh tokens.
   */
  async register(payload: Record<string, any>): Promise<{ message: string; access: string; refresh: string }> {
    const response = await axiosInstance.post<{ message: string; access: string; refresh: string }>('/users/signup/set-password/', payload);
    return response.data;
  },
};
