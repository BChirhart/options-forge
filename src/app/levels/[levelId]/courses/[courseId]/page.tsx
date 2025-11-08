'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import type { Course, Lesson } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import { signOut } from 'firebase/auth';

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  const courseId = params.courseId as string;
  const [user, loading] = useAuthState(auth);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user && levelId && courseId) {
      loadData();
    }
  }, [user, loading, levelId, courseId, router]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      const courseRef = doc(db, `levels/${levelId}/courses`, courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
      }

      const lessonsRef = collection(db, `levels/${levelId}/courses/${courseId}/lessons`);
      const q = query(lessonsRef, orderBy('order'));
      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map((lessonDoc) => ({
        id: lessonDoc.id,
        ...lessonDoc.data(),
      })) as Lesson[];
      setLessons(lessonsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card">Loading course…</div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>{error || 'Course not found'}</p>
            <Link href={`/levels/${levelId}`} className="button-secondary">
              Back to Level
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="brand">
          <span className="brand-logo">OF</span>
          OptionsForge
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="button-danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="course-content">
        <section className="glass-card" style={{ textAlign: 'left' }}>
          <span className="tag">Course</span>
          <h1 className="section-title" style={{ marginTop: '12px', marginBottom: '12px' }}>
            {course.title}
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '18px' }}>
            {course.description ||
              'This module focuses on one specific muscle of your trading game. Work through each lesson and capture the key takeaways in your playbook.'}
          </p>
          <div className="badge-row">
            <span className="badge">Level: {levelId}</span>
            <span className="badge">Sequence #{course.order}</span>
          </div>
        </section>

        <section className="lesson-list">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/levels/${levelId}/courses/${courseId}/lessons/${lesson.id}`}
              className="lesson-card"
            >
              <div className="lesson-icon" aria-hidden>
                📘
              </div>
              <h3>{lesson.title}</h3>
              <p>
                Refine your understanding in a focused lesson. Capture the key insight and how you will apply it in your
                next trade review.
              </p>
              <span className="learn-more">Open lesson</span>
            </Link>
          ))}
        </section>
      </main>

      <footer className="footer">Each lesson builds a stronger trader. Keep your notes close and review often.</footer>
    </div>
  );
}
