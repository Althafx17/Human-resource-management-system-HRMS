// ---> NEW: OTP Signup Phase 3 Component (Password Creation)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { signupApi } from '../../services/signupApi';
import styles from './CreatePassword.module.css';

export default function CreatePassword() {
  const navigate = useNavigate();
  
  // ---> CHANGED: Retrieve both email and token from sessionStorage
  const email = sessionStorage.getItem('signupEmail') || '';
  const verificationToken = sessionStorage.getItem('verificationToken') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // ---> NEW: State to track real-time password validation error
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---> NEW: Real-time password length validation handler
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length > 0 && val.length < 8) {
      setPasswordError('8 characters required');
    } else {
      setPasswordError('');
    }
  };

  useEffect(() => {
    // ---> CHANGED: Redirect if either parameter is missing in sessionStorage
    if (!email || !verificationToken) {
      navigate('/signup');
    }
  }, [email, verificationToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ---> CHANGED: Submit guard validation checks
    if (!password || password.length < 8) {
      setPasswordError('8 characters required');
      return;
    }

    if (!confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // ---> CHANGED: Dispatch registration request to backend endpoint
      const response = await signupApi.register({
        email,
        password,
        verification_token: verificationToken
      });

      const { access, refresh } = response;

      // ---> CHANGED: Store tokens in cookies using js-cookie
      Cookies.set('access_token', access, { secure: true, sameSite: 'strict', expires: 1 });
      Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict', expires: 7 });

      // Save compatible cookies and localStorage variables for session persistency
      Cookies.set('username', email, { expires: 30 });
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', email);

      // ---> CHANGED: Clean up registration parameters from sessionStorage before navigating
      sessionStorage.removeItem('signupEmail');
      sessionStorage.removeItem('verificationToken');

      // ---> CHANGED: Route user immediately to homepage dashboard
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        setError('Verification token has expired or is invalid. Please sign up again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !verificationToken) return null;

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <div className={styles.logoBadge}>Key</div>
          <h2>Set Password</h2>
          <p>Set a secure password for your account <strong>{email}</strong></p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Choose a password (min 8 chars)"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <p className={styles.fieldError}>{passwordError}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading || password !== confirmPassword || password.length < 8}>
            {isLoading ? (
              <span className={styles.loadingFlex}>
                <Loader className={styles.spinner} size={18} />
                Creating Account...
              </span>
            ) : (
              'Complete Sign Up'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
