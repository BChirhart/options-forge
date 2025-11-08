'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import type { Lesson } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import { signOut } from 'firebase/auth';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const [user, loading] = useAuthState(auth);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user && levelId && courseId && lessonId) {
      loadLesson();
    }
  }, [user, loading, levelId, courseId, lessonId, router]);

  const loadLesson = async () => {
    try {
      setLoadingData(true);
      setError(null);

      const lessonRef = doc(db, `levels/${levelId}/courses/${courseId}/lessons`, lessonId);
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        setLesson({ id: lessonSnap.id, ...lessonSnap.data() } as Lesson);
      } else {
        setError('Lesson not found');
      }
    } catch (err) {
      console.error('Error loading lesson:', err);
      setError('Failed to load lesson');
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
          <div className="glass-card">Loading lesson…</div>
        </main>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>{error || 'Lesson not found'}</p>
            <Link href={`/levels/${levelId}/courses/${courseId}`} className="button-secondary">
              Back to Course
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

      <main className="lesson-content">
        <section className="glass-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between' }}>
            <Link href={`/levels/${levelId}/courses/${courseId}`} className="button-secondary" style={{ order: 2 }}>
              ← Back to course
            </Link>
            <span className="tag" style={{ order: 1 }}>Lesson</span>
          </div>
          <h1 className="section-title" style={{ margin: 0 }}>{lesson.title}</h1>
          <p className="section-subtitle">
            Focus on the core insight of this lesson. Capture the decision triggers, risk parameters, and next action in
            your trading journal.
          </p>
        </section>

        <section className="glass-card" style={{ display: 'grid', gap: '1.5rem' }}>
          {lesson.videoId && (
            <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  background: 'rgba(99, 102, 241, 0.08)',
                  borderRadius: '18px',
                }}
              >
                <iframe
                  src={`https://player.vimeo.com/video/${lesson.videoId}`}
                  title={lesson.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {lesson.textContent && (
            <article style={{ display: 'grid', gap: '1rem', color: 'var(--text-secondary)' }}>
              {lesson.textContent.split('\n').map((paragraph, idx) => (
                <p key={idx} style={{ margin: 0 }}>
                  {paragraph}
                </p>
              ))}
            </article>
          )}

          <div className="badge-row">
            <span className="badge">Order #{lesson.order}</span>
            <span className="badge">Reflect &amp; apply</span>
          </div>
        </section>
      </main>

      <footer className="footer">Great traders review each lesson twice—once to learn it, once to own it.</footer>
    </div>
  );
}
