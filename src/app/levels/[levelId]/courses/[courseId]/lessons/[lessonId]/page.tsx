'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { signOut } from 'firebase/auth';
import { getLesson } from '@/services/content';
import Quiz, { type QuizQuestion } from '@/components/Quiz';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  // Load content synchronously from files
  const lesson = getLesson(levelId, courseId, lessonId);

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
          <div className="glass-card">Loading lesson…</div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>Lesson not found</p>
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
          {lesson.videoId && lesson.videoId.trim() && !lesson.videoId.startsWith('placeholder') && (
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
              {lesson.textContent.split('\n\n').map((paragraph, idx) => {
                // Skip empty paragraphs
                if (!paragraph.trim()) return null;
                
                // Check if paragraph contains bullet points
                const lines = paragraph.split('\n').filter(line => line.trim());
                const hasBullets = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
                
                if (hasBullets) {
                  // Split into intro text and bullet items
                  const introLines: string[] = [];
                  const bulletItems: string[] = [];
                  let foundBullets = false;
                  
                  lines.forEach(line => {
                    const trimmed = line.trim();
                    if ((trimmed.startsWith('•') || trimmed.startsWith('-')) && !foundBullets) {
                      foundBullets = true;
                    }
                    if (foundBullets && (trimmed.startsWith('•') || trimmed.startsWith('-'))) {
                      bulletItems.push(trimmed);
                    } else if (!foundBullets) {
                      introLines.push(line);
                    }
                  });
                  
                  return (
                    <div key={idx}>
                      {introLines.length > 0 && (
                        <p style={{ margin: 0, marginBottom: '0.5rem', lineHeight: '1.6' }}>
                          {introLines.join(' ')}
                        </p>
                      )}
                      {bulletItems.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'none' }}>
                          {bulletItems.map((item, itemIdx) => (
                            <li key={itemIdx} style={{ marginBottom: '0.5rem', position: 'relative', lineHeight: '1.6' }}>
                              <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
                              {item.replace(/^[•-]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
                
                // Regular paragraph - check if it's a heading (no period, shorter, bold-like)
                const isHeading = paragraph.length < 100 && !paragraph.includes('.') && paragraph.split(' ').length < 10;
                
                return (
                  <div key={idx}>
                    {isHeading ? (
                      <h3 style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        {paragraph}
                      </h3>
                    ) : (
                      <p style={{ margin: 0, lineHeight: '1.6' }}>
                        {paragraph}
                      </p>
                    )}
                  </div>
                );
              })}
            </article>
          )}

          <div className="badge-row">
            <span className="badge">Page #{lesson.order}</span>
            <span className="badge">Introduction</span>
          </div>
        </section>

        {lesson.questions && lesson.questions.length > 0 && (
          <section className="glass-card">
            <Quiz questions={lesson.questions as QuizQuestion[]} />
          </section>
        )}
      </main>

      <footer className="footer">Great traders review each lesson twice—once to learn it, once to own it.</footer>
    </div>
  );
}
