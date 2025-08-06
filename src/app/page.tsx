'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import the router
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginButton from '@/components/LoginButton';

export default function Home() {
  const router = useRouter(); // 2. Initialize the router

  // This effect now handles the redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 3. If a user is found, immediately send them to the dashboard
      if (user) {
        router.push('/dashboard');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [router]); // 4. Add router to the dependency array

  // The UI is now simplified to just be a login portal
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to OptionsForge</h1>
      <div className="mt-8">
        <LoginButton />
        <p className="mt-4 text-sm text-gray-500">Please sign in to continue.</p>
      </div>
    </main>
  );
}