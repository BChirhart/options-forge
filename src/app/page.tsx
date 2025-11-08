'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card">Loading...</div>
        </main>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
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
        </div>
      </header>

      <main className="hero">
        <span className="hero-pill">
          <span role="img" aria-hidden>
            ✨
          </span>
          A structured path to confident options trading
        </span>
        <h1 className="hero-title">Master options trading with clarity—not chaos.</h1>
        <p className="hero-subtitle">
          OptionsForge delivers curated lessons, guided practice, and a playbook you can trust. No hype—just
          professional-grade education for traders who want to do this right.
        </p>
        <div className="hero-actions">
          <button className="button-primary" onClick={handleSignIn}>
            Sign in with Google
          </button>
          <button
            className="button-secondary"
            onClick={() => {
              document.getElementById('tracks-preview')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Preview the curriculum
          </button>
        </div>

        <ul className="feature-list">
          <li>
            <span role="img" aria-hidden>
              📈
            </span>
            Three progressive tracks designed to move you from fundamentals to professional strategies
          </li>
          <li>
            <span role="img" aria-hidden>
              🧩
            </span>
            Bite-sized lessons, focused drills, and decision frameworks used by real traders
          </li>
          <li>
            <span role="img" aria-hidden>
              🛠️
            </span>
            Actionable resources you can download, reuse, and revisit whenever you need a refresher
          </li>
        </ul>

        <div className="hero-grid" id="tracks-preview">
          <div className="glass-card">
            <p className="tag">Learning Tracks</p>
            <h3 style={{ marginTop: '12px', marginBottom: '8px' }}>Beginner • Intermediate • Advanced</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Each track is curated so you always know exactly what to learn next—and why.
            </p>
          </div>
          <div className="glass-card">
            <p className="tag">Built by Traders</p>
            <h3 style={{ marginTop: '12px', marginBottom: '8px' }}>Frameworks over guesswork</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Learn to evaluate trades with professional-grade checklists, risk models, and exit plans.
            </p>
          </div>
          <div className="glass-card">
            <p className="tag">Always-on Access</p>
            <h3 style={{ marginTop: '12px', marginBottom: '8px' }}>Study on your schedule</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Replay lessons, revisit milestones, and pace yourself—everything stays in sync with your account.
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">© {new Date().getFullYear()} OptionsForge. Crafted for disciplined traders.</footer>
    </div>
  );
}
