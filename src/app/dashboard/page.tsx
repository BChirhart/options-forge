'use client';

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useEffect } from 'react';

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  // This effect runs when the user or loading state changes.
  useEffect(() => {
    // If loading is finished and there's no user, redirect to home.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // While we're checking for the user, show a loading message.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is logged in, show the dashboard.
  return (
    <div>
      <h1>Welcome to your Dashboard, {user?.displayName}!</h1>
      <p>This is a protected page.</p>
      {/* We'll add the course list here later */}
    </div>
  );
}