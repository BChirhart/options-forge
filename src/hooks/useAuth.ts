'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { User } from '@/types';

interface UseAuthReturn {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
  isAuthenticated: boolean;
}

/**
 * Custom hook for authentication state management
 * Handles auth state and automatic redirects for protected routes
 */
export function useAuth(redirectIfUnauthenticated = false): UseAuthReturn {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && redirectIfUnauthenticated) {
      router.push('/');
    }
  }, [user, loading, redirectIfUnauthenticated, router]);

  const userData: User | null | undefined = user
    ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }
    : null;

  return {
    user: userData,
    loading,
    error,
    isAuthenticated: !!user,
  };
}


