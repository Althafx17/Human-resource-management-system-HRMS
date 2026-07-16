// ---> NEW: OTP Signup Phase 1 Component (Email Collection)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, AlertCircle, Loader } from 'lucide-react';
import { signupApi } from '../../apis/auth/signupApi';
import styles from './SignupEmail.module.css';

export default function SignupEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // ---> CHANGED: Dispatch OTP request to the Django endpoint
      await signupApi.sendOtp(email.trim());

      // ---> CHANGED: Save email in sessionStorage
      sessionStorage.setItem('signupEmail', email.trim());
      
      // ---> CHANGED: Route to Verify OTP page
      navigate('/verify-otp');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.email) {
        setError(err.response.data.email[0] || 'Invalid email address');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <div className={styles.logoBadge}>HR</div>
          <h2>Create Account</h2>
          <p>Enter your email to receive a verification code</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <span className={styles.loadingFlex}>
                <Loader className={styles.spinner} size={18} />
                Sending Verification Code...
              </span>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
}
