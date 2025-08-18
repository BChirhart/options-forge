import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

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

// This is an async Server Component.
export default async function LessonPage({ params }: LessonPageProps) {
  const { levelId, courseId, lessonId } = params;

  // We fetch the data directly on the server.
  const lessonRef = doc(db, `levels/${levelId}/courses/${courseId}/lessons`, lessonId);
  const lessonSnap = await getDoc(lessonRef);

  // If the lesson doesn't exist, show a "not found" message.
  if (!lessonSnap.exists()) {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Lesson Not Found</h1>
            <p className="mt-4">Could not find the requested lesson. Please check the URL.</p>
            <Link href={`/levels/${levelId}/courses/${courseId}`} className="text-blue-400 hover:underline mt-6 inline-block">
                &larr; Back to Lessons
            </Link>
        </div>
    );
  }

  const lesson = lessonSnap.data() as Lesson;
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
        ></iframe>
      </div>

      <div className="mt-8 prose prose-invert max-w-none">
        <p>{lesson.textContent}</p>
      </div>
    </div>
  );
}
