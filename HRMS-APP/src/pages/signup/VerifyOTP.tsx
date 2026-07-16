// ---> NEW: OTP Signup Phase 2 Component (OTP Verification)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, AlertCircle, Loader } from 'lucide-react';
import { signupApi } from '../../apis/auth/signupApi';
import styles from './VerifyOTP.module.css';

export default function VerifyOTP() {
  const navigate = useNavigate();
  
  // ---> CHANGED: Retrieve email from sessionStorage
  const email = sessionStorage.getItem('signupEmail') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ---> CHANGED: Redirect if email is not present in sessionStorage
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // ---> CHANGED: Dispatch validation request to backend endpoint
      const response = await signupApi.verifyOtp(email, otp.trim());

      const { verification_token } = response;

      // ---> CHANGED: Save verificationToken in sessionStorage for persistence
      sessionStorage.setItem('verificationToken', verification_token);

      // ---> CHANGED: Route to the final Password Creation view without state object
      navigate('/create-password');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid or expired verification code. Please check and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <div className={styles.logoBadge}>OTP</div>
          <h2>Verification</h2>
          <p>Please enter the verification code sent to <strong>{email}</strong></p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="otp">Verification Code</label>
            <div className={styles.inputWrapper}>
              <KeyRound className={styles.inputIcon} size={18} />
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <span className={styles.loadingFlex}>
                <Loader className={styles.spinner} size={18} />
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </button>
        </form>

        <p className={styles.infoHint}>
          Code is valid for 5 minutes.
        </p>
      </div>
    </div>
  );
}
