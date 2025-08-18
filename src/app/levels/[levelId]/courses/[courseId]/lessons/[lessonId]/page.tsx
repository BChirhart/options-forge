'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

// Define a type for our lesson data
interface Lesson {
  title: string;
  videoId: string;
  textContent: string;
}

type LessonPageProps = {
  params: {
    levelId: string;
    courseId: string;
    lessonId: string;
  };
};

export default function LessonPage({ params }: LessonPageProps) {
  const { levelId, courseId, lessonId } = params;
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    // This effect handles both protecting the route and fetching the data
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user && levelId && courseId && lessonId) {
      const fetchLesson = async () => {
        const lessonRef = doc(db, `levels/${levelId}/courses/${courseId}/lessons`, lessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
          setLesson(lessonSnap.data() as Lesson);
        } else {
          // Handle case where lesson is not found
          console.error("Lesson not found!");
        }
      };

      fetchLesson();
    }
  }, [user, loading, levelId, courseId, lessonId, router]);

  // Show a loading state while we wait for auth and data
  if (loading || !lesson) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading Lesson...</p>
        </div>
    );
  }

  // Construct the correct Vimeo embed URL from our lesson data
  const videoSrc = `https://player.vimeo.com/video/${lesson.videoId}`;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href={`/levels/${levelId}/courses/${courseId}`} className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Back to Lessons
      </Link>

      <h1 className="text-4xl font-bold">{lesson.title}</h1>
      
      <div className="mt-8 aspect-video w-full rounded-lg overflow-hidden">
        {/* Use a standard iframe, just like in our successful test.html */}
        <iframe
          src={videoSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={lesson.title}
        ></iframe>
      </div>

      <div className="mt-8 prose prose-invert max-w-none">
        <p>{lesson.textContent}</p>
      </div>
    </div>
  );
}
