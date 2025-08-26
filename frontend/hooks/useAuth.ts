// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

/**
 * A custom hook to manage and protect routes based on JWT authentication.
 * It checks for a token, validates its expiration, and provides an auth status.
 * @returns {boolean} isAuthenticated - True if the user has a valid token, false otherwise.
 */
export const useAuth = (): boolean => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      // If no token is found, redirect to the auth page.
      router.push('/auth');
      return;
    }

    try {
      // Decode the token to check its expiration date
      const decodedToken: { exp: number } = jwtDecode(token);
      
      // The 'exp' claim is in seconds, so we multiply by 1000 to compare with milliseconds
      if (decodedToken.exp * 1000 < Date.now()) {
        // Token is expired
        localStorage.removeItem('authToken');
        router.push('/auth');
      } else {
        // Token is valid
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token is invalid or malformed
      console.error("Invalid token:", error);
      localStorage.removeItem('authToken');
      router.push('/auth');
    }
  }, [router]);

  return isAuthenticated;
};
