'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { fetchLesson } from '@/services/firestore';
import type { Lesson } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

type LessonPageClientProps = {
  levelId: string;
  courseId: string;
  lessonId: string;
};

export default function LessonPageClient({ levelId, courseId, lessonId }: LessonPageClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user && levelId && courseId && lessonId) {
      const loadLesson = async () => {
        try {
          setLoading(true);
          setError(null);
          const lessonData = await fetchLesson(levelId, courseId, lessonId);
          
          if (!lessonData) {
            setError(new Error('Lesson not found'));
            return;
          }
          
          setLesson(lessonData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load lesson'));
        } finally {
          setLoading(false);
        }
      };
      loadLesson();
    }
  }, [user, levelId, courseId, lessonId]);

  if (authLoading) {
    return <LoadingSpinner message="Loading lesson..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error Loading Lesson"
        message={error.message}
        onRetry={() => {
          setError(null);
          if (user && levelId && courseId && lessonId) {
            fetchLesson(levelId, courseId, lessonId)
              .then((lessonData) => {
                if (lessonData) {
                  setLesson(lessonData);
                } else {
                  setError(new Error('Lesson not found'));
                }
              })
              .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load lesson')))
              .finally(() => setLoading(false));
          }
        }}
        backHref={`/levels/${levelId}/courses/${courseId}`}
        backLabel="Back to Lessons"
      />
    );
  }

  if (loading || !lesson) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Link href={`/levels/${levelId}/courses/${courseId}`} className="text-blue-400 hover:underline mb-6 inline-block">
          &larr; Back to Lessons
        </Link>
        <LoadingSpinner message="Loading lesson content..." />
      </div>
    );
  }

  const videoSrc = `https://player.vimeo.com/video/${lesson.videoId}`;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href={`/levels/${levelId}/courses/${courseId}`} className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Back to Lessons
      </Link>

      <h1 className="text-4xl font-bold">{lesson.title}</h1>
      
      <div className="mt-8 aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          src={videoSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={lesson.title}
          className="w-full h-full"
        ></iframe>
      </div>

      <div className="mt-8 prose prose-invert max-w-none">
        <p className="text-gray-300 whitespace-pre-wrap">{lesson.textContent}</p>
      </div>
    </div>
  );
}


