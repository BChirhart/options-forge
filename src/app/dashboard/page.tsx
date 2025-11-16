'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { getLevelSummaries } from '@/services/content';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const firstName = useMemo(() => {
    if (!user?.displayName) return 'Trader';
    return user.displayName.split(' ')[0];
  }, [user?.displayName]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  // Load content synchronously from files
  const levels = getLevelSummaries();
  const courseTotal = levels.reduce((sum, level) => sum + level.courseCount, 0);
  const lessonTotal = levels.reduce((sum, level) => sum + level.lessonCount, 0);

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
          <div className="glass-card">Loading your workspace...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link href="/dashboard" className="brand" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <span className="brand-logo">OF</span>
          OptionsForge
        </Link>
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
