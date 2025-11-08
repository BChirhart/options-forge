'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import type { Course, Level } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import { signOut } from 'firebase/auth';

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
  const [level, setLevel] = useState<Level | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user && levelId) {
      loadData();
    }
  }, [user, loading, levelId, router]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      const levelRef = doc(db, 'levels', levelId);
      const levelSnap = await getDoc(levelRef);
      if (levelSnap.exists()) {
        setLevel({ id: levelSnap.id, ...levelSnap.data() } as Level);
      }

      const coursesRef = collection(db, `levels/${levelId}/courses`);
      const q = query(coursesRef, orderBy('order'));
      const querySnapshot = await getDocs(q);
      const coursesData = querySnapshot.docs.map((courseDoc) => ({
        id: courseDoc.id,
        ...courseDoc.data(),
      })) as Course[];
      setCourses(coursesData);
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
          <div className="glass-card">Loading track…</div>
        </main>
      </div>
    );
  }

  if (error || !level) {
    return (
      <div className="app-shell">
        <main className="hero">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>{error || 'Level not found'}</p>
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
