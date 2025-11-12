'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { signOut } from 'firebase/auth';
import { getLevel, getCourses } from '@/services/content';

const levelDescriptions: Record<string, string> = {
  beginner:
    'Build a rock-solid foundation. Understand how options behave, the language traders use, and the structure of a trade.',
  intermediate:
    'Transition from theory to execution. Evaluate setups, manage risk, and rehearse professional trading habits.',
  advanced:
    'Apply layered strategies with confidence. Build playbooks, hedge intelligently, and operate with a pro mindset.',
};

export default function LevelPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  // Load content synchronously from files
  const level = getLevel(levelId);
  const courses = getCourses(levelId);

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
          <div className="glass-card">Loading track…</div>
        </main>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>Level not found</p>
            <Link href="/dashboard" className="button-secondary">
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const description = levelDescriptions[level.id] ||
    'Structured lessons to help you progress with clarity and focus. Every module is designed to build on the previous one.';

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

      <main className="level-content">
        <section className="glass-card" style={{ textAlign: 'left' }}>
          <span className="tag">Learning Track</span>
          <h1 className="section-title" style={{ marginTop: '12px', marginBottom: '12px' }}>
            {level.title}
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '20px' }}>
            {description}
          </p>
          <div className="badge-row">
            <span className="badge">{courses.length} courses</span>
          </div>
        </section>

        <section className="course-grid">
          {courses.map((course) => (
            <Link key={course.id} href={`/levels/${level.id}/courses/${course.id}`} className="course-card">
              <div className="course-icon" aria-hidden>
                🎯
              </div>
              <h3>{course.title}</h3>
              <p>{course.description || 'A focused module to move you one step closer to confident execution.'}</p>
              <div className="badge-row">
                <span className="badge">Module {course.order}</span>
              </div>
              <span className="learn-more">View lessons</span>
            </Link>
          ))}
        </section>
      </main>

      <footer className="footer">Track crafted by OptionsForge • Study intentionally, practice deliberately.</footer>
    </div>
  );
}
