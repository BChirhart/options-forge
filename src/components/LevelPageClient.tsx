'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { fetchCourses } from '@/services/firestore';
import type { Course } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { SkeletonGrid } from '@/components/SkeletonLoader';

type LevelPageClientProps = {
  levelId: string;
};

export default function LevelPageClient({ levelId }: LevelPageClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user && levelId) {
      const loadCourses = async () => {
        try {
          setLoading(true);
          setError(null);
          const coursesData = await fetchCourses(levelId);
          setCourses(coursesData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load courses'));
        } finally {
          setLoading(false);
        }
      };
      loadCourses();
    }
  }, [user, levelId]);

  if (authLoading) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error Loading Courses"
        message={error.message}
        onRetry={() => {
          setError(null);
          if (user && levelId) {
            fetchCourses(levelId)
              .then(setCourses)
              .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load courses')))
              .finally(() => setLoading(false));
          }
        }}
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/dashboard" className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold capitalize tracking-tight">{levelId} Level Courses</h1>
      
      <div className="mt-10">
        {loading ? (
          <SkeletonGrid count={3} />
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <Link key={course.id} href={`/levels/${levelId}/courses/${course.id}`} className="group">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col justify-between transition-transform duration-300 group-hover:scale-105">
                  <div>
                    <h3 className="font-bold text-xl text-white">{course.title}</h3>
                    <p className="mt-2 text-gray-400 text-sm">{course.description}</p>
                  </div>
                  <div className="mt-6">
                    <span className="font-semibold text-blue-400 group-hover:underline">
                      Start Course →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No courses found for this level.</p>
        )}
      </div>
    </div>
  );
}


