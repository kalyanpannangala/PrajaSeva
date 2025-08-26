// hooks/useIdleTimeout.ts
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

/**
 * A custom hook to automatically log out a user after a period of inactivity.
 * @param {number} timeout - The inactivity time in milliseconds (e.g., 15 minutes is 15 * 60 * 1000).
 */
export const useIdleTimeout = (timeout: number) => {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The function to be called when the user is idle
  const handleLogout = () => {
    // Clear the session token from storage
    localStorage.removeItem('authToken');
    // Redirect the user to the authentication page
    router.push('/auth');
  };

  // Function to reset the inactivity timer
  const resetTimer = () => {
    // Clear the previous timer if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timer
    timeoutRef.current = setTimeout(handleLogout, timeout);
  };

  useEffect(() => {
    // List of events that indicate user activity
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    // Set the initial timer when the component mounts
    resetTimer();

    // Add event listeners to the window to reset the timer on any user activity
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Cleanup function: This is crucial to prevent memory leaks.
    // It runs when the component unmounts.
    return () => {
      // Clear the timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Remove all the event listeners
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, router]); // Re-run the effect if the timeout value changes

  return null; // This hook does not render any UI
};
