'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { fetchCourse, fetchLessons } from '@/services/firestore';
import type { Course, Lesson } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { SkeletonList } from '@/components/SkeletonLoader';

type CoursePageClientProps = {
  levelId: string;
  courseId: string;
};

export default function CoursePageClient({ levelId, courseId }: CoursePageClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user && levelId && courseId) {
      const loadCourseAndLessons = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const [courseData, lessonsData] = await Promise.all([
            fetchCourse(levelId, courseId),
            fetchLessons(levelId, courseId),
          ]);

          if (!courseData) {
            setError(new Error('Course not found'));
            return;
          }

          setCourse(courseData);
          setLessons(lessonsData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load course'));
        } finally {
          setLoading(false);
        }
      };
      loadCourseAndLessons();
    }
  }, [user, levelId, courseId]);

  if (authLoading) {
    return <LoadingSpinner message="Loading course..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error Loading Course"
        message={error.message}
        onRetry={() => {
          setError(null);
          if (user && levelId && courseId) {
            Promise.all([
              fetchCourse(levelId, courseId),
              fetchLessons(levelId, courseId),
            ])
              .then(([courseData, lessonsData]) => {
                if (courseData) {
                  setCourse(courseData);
                  setLessons(lessonsData);
                } else {
                  setError(new Error('Course not found'));
                }
              })
              .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load course')))
              .finally(() => setLoading(false));
          }
        }}
        backHref={`/levels/${levelId}`}
        backLabel={`Back to ${levelId} Courses`}
      />
    );
  }

  if (loading || !course) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Link href={`/levels/${levelId}`} className="text-blue-400 hover:underline mb-6 inline-block">
          &larr; Back to {levelId} Courses
        </Link>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <SkeletonList count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href={`/levels/${levelId}`} className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Back to {levelId} Courses
      </Link>

      <h1 className="text-4xl font-bold">{course.title}</h1>
      <p className="mt-2 text-lg text-gray-400">{course.description}</p>
      
      <div className="mt-10">
        <h2 className="text-2xl font-semibold border-b pb-2">Lessons</h2>
        {lessons.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {lessons.map(lesson => (
              <li key={lesson.id}>
                <Link 
                  href={`/levels/${levelId}/courses/${courseId}/lessons/${lesson.id}`} 
                  className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span className="text-white">{lesson.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-gray-500">No lessons available for this course.</p>
        )}
      </div>
    </div>
  );
}


