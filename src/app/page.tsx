'use client'; // This component now needs to be a client component

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase'; // Import our configured auth
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import LoginButton from '@/components/LoginButton';

export default function Home() {
  // Create a state variable to store the user's info
  const [user, setUser] = useState<User | null>(null);

  // Use useEffect to run code once when the component loads
  useEffect(() => {
    // onAuthStateChanged is the listener. It gives us the user object if they're
    // logged in, or null if they're logged out.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []); // The empty array ensures this runs only once

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Successfully signed out!");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to OptionsForge</h1>
      
      <div className="mt-8">
        {user ? (
          // If the user IS logged in, show this:
          <div>
            <p>Welcome, {user.displayName || user.email}!</p>
            <button
              onClick={handleLogout}
              className="mt-4 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          // If the user is NOT logged in, show this:
          <LoginButton />
        )}
      </div>
    </main>
  );
}