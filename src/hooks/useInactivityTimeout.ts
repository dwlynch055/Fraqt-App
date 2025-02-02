import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export function useInactivityTimeout() {
  const { signOut } = useAuth();
  const timeoutRef = useRef<number>();

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        signOut();
      }, TIMEOUT_DURATION);
    };

    // Events to track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart'
    ];

    // Set initial timeout
    resetTimeout();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [signOut]);
}