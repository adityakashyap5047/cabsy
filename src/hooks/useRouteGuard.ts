'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseRouteGuardOptions {
  requiredSession?: string;
  redirectTo?: string;
  preventBack?: boolean;
}

export const useRouteGuard = ({
  requiredSession,
  redirectTo = '/ride',
  preventBack = false
}: UseRouteGuardOptions = {}) => {
  const router = useRouter();

  useEffect(() => {
    // Check if required session exists
    if (requiredSession) {
      const sessionExists = sessionStorage.getItem(requiredSession);
      if (!sessionExists) {
        router.replace(redirectTo);
        return;
      }
    }

    // Prevent back navigation if requested
    if (preventBack) {
      const handlePopState = () => {
        // Push the current state again to prevent going back
        window.history.pushState(null, '', window.location.href);
      };

      // Add event listener for back button
      window.addEventListener('popstate', handlePopState);

      // Push initial state
      window.history.pushState(null, '', window.location.href);

      // Cleanup
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [router, requiredSession, redirectTo, preventBack]);

  // Helper function to clear all sessions
  const clearAllSessions = () => {
    sessionStorage.removeItem('payment_confirmed');
    sessionStorage.removeItem('journey_active');
    sessionStorage.removeItem('confirmation_timestamp');
  };

  // Helper function to set session
  const setSession = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
  };

  return {
    clearAllSessions,
    setSession
  };
};

// Hook specifically for payment flow
export const usePaymentGuard = () => {
  return useRouteGuard({
    requiredSession: 'payment_confirmed',
    redirectTo: '/ride',
    preventBack: true
  });
};

// Hook specifically for journey tracking
export const useJourneyGuard = () => {
  return useRouteGuard({
    preventBack: true
  });
};
