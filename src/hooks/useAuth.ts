'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { User } from '@/types';
import { auth } from '@/lib/firebase';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: Error | undefined;
}

/**
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

  return {
    user: user
      ? {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }
      : null,
    loading,
    error,
  };
}


