'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Lesson {
  title?: string;
  videoId?: string;     // Accepts a Vimeo ID (digits) OR a full Vimeo URL
  textContent?: string;
}

type LessonPageProps = {
  params: { levelId: string; courseId: string; lessonId: string };
};

export default function LessonPage({ params }: LessonPageProps) {
  const { levelId, courseId, lessonId } = params;
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
    if (user) {
      const fetchLesson = async () => {
        const lessonRef = doc(db, `levels/${levelId}/courses/${courseId}/lessons`, lessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) setLesson(lessonSnap.data() as Lesson);
      };
      fetchLesson();
    }
  }, [user, loading, levelId, courseId, lessonId, router]);

  if (loading || !lesson) return <div>Loading...</div>;

  // Build a Vimeo URL from either a full URL or a numeric ID. Otherwise return null.
  function buildVimeoUrl(input?: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();

    // If it's already a URL, only allow vimeo.com/player.vimeo.com forms
    if (/^https?:\/\//i.test(trimmed)) {
      if (/vimeo\.com/i.test(trimmed)) return trimmed;
      return null;
    }

    // If it's digits, treat as a Vimeo ID
    if (/^\d+$/.test(trimmed)) return `https://vimeo.com/${trimmed}`;

    return null;
  }

  const videoUrl = buildVimeoUrl(lesson.videoId);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href={`/levels/${levelId}/courses/${courseId}`}
        className="text-blue-400 hover:underline mb-6 inline-block"
      >
        &larr; Back to Lessons
      </Link>

      <h1 className="text-4xl font-bold">{lesson.title ?? 'Lesson'}</h1>

      <div className="mt-8 aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-gray-900">
        {videoUrl ? (
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls
            config={{
              vimeo: { playerOptions: { title: 1, byline: 0, portrait: 0 } },
            }}
            onError={(e) => console.warn('Video failed to load:', e)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No video yet.
          </div>
        )}
      </div>

      {lesson.textContent ? (
        <div className="mt-8 prose prose-invert max-w-none">
          <p>{lesson.textContent}</p>
        </div>
      ) : null}
    </div>
  );
}
