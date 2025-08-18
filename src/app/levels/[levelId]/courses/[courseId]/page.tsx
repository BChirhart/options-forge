'use client';

import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

// Define types for our data
interface Lesson {
  id: string;
  title: string;
}
interface Course {
    title: string;
    description: string;
}

type CoursePageProps = {
  params: {
    levelId: string;
    courseId: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  const { levelId, courseId } = params;
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      const fetchCourseAndLessons = async () => {
        // Fetch the course details
        const courseRef = doc(db, `levels/${levelId}/courses`, courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
            setCourse(courseSnap.data() as Course);
        }

        // Fetch the lessons for this course
        const lessonsQuery = query(
          collection(db, `levels/${levelId}/courses/${courseId}/lessons`),
          orderBy('order')
        );
        const querySnapshot = await getDocs(lessonsQuery);
        const lessonsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Lesson[];
        setLessons(lessonsData);
      };

      fetchCourseAndLessons();
    }
  }, [user, loading, levelId, courseId, router]);

  if (loading || !course) {
    return <div>Loading...</div>;
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
        <ul className="mt-6 space-y-3">
            {lessons.map(lesson => (
                <li key={lesson.id}>
                    <Link href={`/levels/${levelId}/courses/${courseId}/lessons/${lesson.id}`} className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                        <span className="text-white">{lesson.title}</span>
                    </Link>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
