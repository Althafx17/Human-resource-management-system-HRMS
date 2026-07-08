import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL resolves to backend target
const apiBaseUrl = 'https://employee-management-api-sigma.vercel.app/api';

// 1. Create the base Axios instance
export const axiosInstance = axios.create({
  baseURL: apiBaseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
  // ---> CHANGED: Keep this true if your Django backend expects credentials/cookies for CSRF
  withCredentials: true, 
});

// 2. REQUEST INTERCEPTOR: Attach the access token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR: The Permanent Fix for 401 Expired Tokens
axiosInstance.interceptors.response.use(
  (response) => response, // If the request succeeds, just return the response
  async (error) => {
    const originalRequest = error.config;

    // ---> NEW: Check if the error is 401 (Unauthorized) AND we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Mark this request as retried so we don't get stuck in an infinite loop
      originalRequest._retry = true; 

      try {
        // Get the refresh token from cookies
        const refreshToken = Cookies.get('refresh_token');
        
        // If there is no refresh token, we can't do anything. Force logout.
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // ---> NEW: Ask Django for a new access token. 
        // CRITICAL: We use standard 'axios.post' here, NOT 'axiosInstance', 
        // to prevent this refresh request from being caught in the interceptor loop.
        // NOTE: Path corrected to match Django's active users refresh namespace.
        const response = await axios.post(`${apiBaseUrl}/users/refresh/`, {
          refresh: refreshToken
        });

        // Get the brand new access token from Django's response
        const newAccessToken = response.data.access;

        // Save the new token back into cookies
        Cookies.set('access_token', newAccessToken, { secure: true, sameSite: 'strict' });

        // If Django also sent a new refresh token (some setups do this), save it too
        if (response.data.refresh) {
          Cookies.set('refresh_token', response.data.refresh, { secure: true, sameSite: 'strict' });
        }

        // Update the failed request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // ---> NEW: Retry the original failed request (e.g., saving the attendance)
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // ---> NEW: If the refresh token is ALSO expired, clear everything and redirect to login
        console.error("Refresh token expired. Forcing logout.", refreshError);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        
        // Redirect the user back to the login page
        window.location.href = '/login'; 
        
        return Promise.reject(refreshError);
      }
    }

    // For all other errors (404, 500, etc.), just return the error normally
    return Promise.reject(error);
  }
);
