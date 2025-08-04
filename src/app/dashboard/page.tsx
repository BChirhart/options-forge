'use client';

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import Link from 'next/link'; // 1. Import the Link component

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
}

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchCourses = async () => {
        const coursesQuery = query(collection(db, 'courses'));
        const querySnapshot = await getDocs(coursesQuery);
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Course[];
        setCourses(coursesData);
      };
      fetchCourses();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard, {user?.displayName}!</h1>
      
      <div className="mt-10">
        <h2 className="text-2xl font-semibold border-b pb-2">Available Courses</h2>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            // 2. Wrap the card div in a Link component
            <Link key={course.id} href={`/courses/${course.id}`}>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                <h3 className="font-bold text-xl text-white">{course.title}</h3>
                <p className="mt-2 text-gray-400">{course.description}</p>
                <div className="mt-4">
                  <span className="text-sm text-white bg-blue-500 px-3 py-1 rounded-full">{course.difficulty}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {courses.length === 0 && (
          <p className="mt-4 text-gray-500">No courses available yet.</p>
        )}
      </div>
    </div>
  );
}