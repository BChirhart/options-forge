'use client';

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { signOut } from 'firebase/auth'; // 1. Import signOut

// Define a type for our level data
interface Level {
  id: string;
  title: string;
}

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([]);

  // 2. Add the handleLogout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will automatically redirect to home
      console.log("Successfully signed out!");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchLevels = async () => {
        const levelsQuery = query(collection(db, 'levels'), orderBy('order'));
        const querySnapshot = await getDocs(levelsQuery);
        const levelsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Level[];
        setLevels(levelsData);
      };
      fetchLevels();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* 3. Add a header with the logout button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user?.displayName}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-semibold border-b pb-2">Available Levels</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map(level => (
            <Link key={level.id} href={`/levels/${level.id}`}>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                <h3 className="font-bold text-xl text-white">{level.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
