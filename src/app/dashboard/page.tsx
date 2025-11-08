'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import type { Level } from '@/types';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

interface LevelSummary extends Level {
  courseCount: number;
  lessonCount: number;
}

const levelMeta: Record<string, { icon: string; tagline: string }> = {
  beginner: {
    icon: '🚀',
    tagline: 'Lay the groundwork, understand every moving part of an option.',
  },
  intermediate: {
    icon: '🎯',
    tagline: 'Start evaluating setups, manage risk, and practice execution.',
  },
  advanced: {
    icon: '🧠',
    tagline: 'Build repeatable strategies with professional-style playbooks.',
  },
};

export default function Dashboard() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [levels, setLevels] = useState<LevelSummary[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [courseTotal, setCourseTotal] = useState(0);
  const [lessonTotal, setLessonTotal] = useState(0);

  const firstName = useMemo(() => {
    if (!user?.displayName) return 'Trader';
    return user.displayName.split(' ')[0];
  }, [user?.displayName]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadLevels();
    }
  }, [user, loading, router]);

  const loadLevels = async () => {
    try {
      setLoadingLevels(true);
      setError(null);
      const levelsRef = collection(db, 'levels');
      const qLevels = query(levelsRef, orderBy('order'));
      const levelSnapshot = await getDocs(qLevels);
      let totalCourses = 0;
      let totalLessons = 0;

      const summaries: LevelSummary[] = [];
      for (const levelDoc of levelSnapshot.docs) {
        const levelData = { id: levelDoc.id, ...(levelDoc.data() as Omit<Level, 'id'>) } as Level;
        const coursesSnap = await getDocs(collection(db, `levels/${levelDoc.id}/courses`));
        let levelLessonCount = 0;

        for (const courseDoc of coursesSnap.docs) {
          const lessonsSnap = await getDocs(
            collection(db, `levels/${levelDoc.id}/courses/${courseDoc.id}/lessons`)
          );
          levelLessonCount += lessonsSnap.size;
        }

        const summary: LevelSummary = {
          ...levelData,
          courseCount: coursesSnap.size,
          lessonCount: levelLessonCount,
        };

        totalCourses += coursesSnap.size;
        totalLessons += levelLessonCount;
        summaries.push(summary);
      }

      setLevels(summaries);
      setCourseTotal(totalCourses);
      setLessonTotal(totalLessons);
    } catch (err) {
      console.error('Error loading levels:', err);
      setError('Failed to load levels');
    } finally {
      setLoadingLevels(false);
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

  if (loading || loadingLevels) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card">Loading your workspace...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
            <button className="button-primary" onClick={loadLevels}>
              Retry
            </button>
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

      <main className="page-content">
        <section className="glass-card" style={{ textAlign: 'left' }}>
          <span className="tag">Welcome back</span>
          <h1 className="section-title" style={{ marginTop: '12px', marginBottom: '14px' }}>
            Hey {firstName}, ready to sharpen your edge today?
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '22px' }}>
            Pick up the next milestone in your track or revisit any concept you want to tighten up.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
            <Link href={`/levels/${levels[0]?.id || 'beginner'}`} className="button-primary">
              Resume from Beginner track
            </Link>
            <Link href={`/levels/${levels.at(-1)?.id || 'advanced'}`} className="button-secondary">
              Explore Advanced strategies
            </Link>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="label">Tracks Available</span>
            <span className="value">{levels.length}</span>
            <span className="section-subtitle">Each track builds on the previous. Start where you are.</span>
          </div>
          <div className="stat-card">
            <span className="label">Courses Curated</span>
            <span className="value">{courseTotal}</span>
            <span className="section-subtitle">Actionable modules with checklists, not fluff.</span>
          </div>
          <div className="stat-card">
            <span className="label">Bite-sized Lessons</span>
            <span className="value">{lessonTotal}</span>
            <span className="section-subtitle">Designed for focus—learn, pause, and apply instantly.</span>
          </div>
        </section>

        <section className="level-grid">
          {levels.map((level, index) => {
            const meta = levelMeta[level.id] || {
              icon: '📘',
              tagline: 'Structured content to help you move forward with confidence.',
            };
            const accentClass = index === 0 ? 'accent-beginner' : index === 1 ? 'accent-intermediate' : 'accent-advanced';

            return (
              <Link key={level.id} href={`/levels/${level.id}`} className={`level-card ${accentClass}`}>
                <div className="level-icon" aria-hidden>
                  {meta.icon}
                </div>
                <h3>{level.title}</h3>
                <p>{meta.tagline}</p>
                <div className="badge-row">
                  <span className="badge">{level.courseCount} courses</span>
                  <span className="badge">{level.lessonCount} lessons</span>
                </div>
                <span className="learn-more">Go to track</span>
              </Link>
            );
          })}
        </section>

        <section className="glass-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <span className="tag">Next step suggestion</span>
          <h2 className="section-title" style={{ margin: 0 }}>
            Build a repeatable review routine
          </h2>
          <p className="section-subtitle">
            Give yourself 15 minutes to recap what you learned today. Log your notes, capture questions, and plan a
            small action to apply the concept in real market conditions.
          </p>
          <div className="badge-row">
            <span className="badge">Reflection habit</span>
            <span className="badge">Executable practice</span>
            <span className="badge">Trader mindset</span>
          </div>
        </section>
      </main>

      <footer className="footer">© {new Date().getFullYear()} OptionsForge. Forging disciplined traders, one lesson at a time.</footer>
    </div>
  );
}
