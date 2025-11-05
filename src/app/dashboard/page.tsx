'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchLevels } from '@/services/firestore';
import type { Level } from '@/types';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { SkeletonGrid } from '@/components/SkeletonLoader';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(true);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out', error);
      setError(error instanceof Error ? error : new Error('Failed to sign out'));
    }
  };

  useEffect(() => {
    if (user) {
      const loadLevels = async () => {
        try {
          setLoading(true);
          setError(null);
          const levelsData = await fetchLevels();
          setLevels(levelsData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load levels'));
        } finally {
          setLoading(false);
        }
      };
      loadLevels();
    }
  }, [user]);

  if (authLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error Loading Dashboard"
        message={error.message}
        onRetry={() => {
          setError(null);
          if (user) {
            fetchLevels()
              .then(setLevels)
              .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load levels')))
              .finally(() => setLoading(false));
          }
        }}
      />
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
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
        <div className="mt-6">
          {loading ? (
            <SkeletonGrid count={3} />
          ) : levels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map(level => (
                <Link key={level.id} href={`/levels/${level.id}`}>
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                    <h3 className="font-bold text-xl text-white">{level.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No levels available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
