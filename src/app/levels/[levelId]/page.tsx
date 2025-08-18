'use client';

import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

// Define types for our data
interface Course {
  id: string;
  title: string;
  description: string;
}

type LevelPageProps = {
  params: {
    levelId: string;
  };
};

export default function LevelPage({ params }: LevelPageProps) {
  const { levelId } = params;
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      const fetchCourses = async () => {
        const coursesQuery = query(
          collection(db, `levels/${levelId}/courses`),
          orderBy('order')
        );
        const querySnapshot = await getDocs(coursesQuery);
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);
      };

      fetchCourses();
    }
  }, [user, loading, levelId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/dashboard" className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold capitalize tracking-tight">{levelId} Level Courses</h1>
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {courses.length === 0 && !loading && (
        <p className="mt-4 text-gray-500">No courses found for this level.</p>
      )}
    </div>
  );
}
