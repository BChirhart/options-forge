'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { signOut } from 'firebase/auth';
import { getCourse, getLessons } from '@/services/content';

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  const courseId = params.courseId as string;
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  // Load content synchronously from files
  const course = getCourse(levelId, courseId);
  const lessons = getLessons(levelId, courseId);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card">Loading course…</div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>Course not found</p>
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
