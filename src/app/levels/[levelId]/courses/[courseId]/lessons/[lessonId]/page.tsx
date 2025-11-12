'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { signOut } from 'firebase/auth';
import { getLesson, getLessons } from '@/services/content';
import Quiz, { type QuizQuestion } from '@/components/Quiz';
import Tooltip from '@/components/Tooltip';

// Tooltip definitions
const tooltipDefinitions: Record<string, string> = {
  premium: 'The cost of the option, per share',
  'strike price': 'The agreed upon stock price in the contract',
  strike: 'The agreed upon stock price in the contract',
  'expiration date': 'The last day that the contract is able to be exercised.',
  call: 'The right to buy stock at a set price within a defined amount of time',
  put: 'The right to sell stock at a set price within a defined amount of time',
  exercise: 'You act on your option call.',
  exercised: 'You act on your option call.',
  exercising: 'You act on your option call.',
};

// Helper function to highlight key terms in text with tooltips
function highlightText(text: string) {
  const patterns = [
    { regex: /\$(\d+)/g, color: '#10b981', weight: 600 }, // Dollar amounts in green
    { regex: /\b(strike price)\b/gi, color: 'var(--brand-secondary)', weight: 600, tooltip: 'strike price' }, // Strike price with tooltip
    { regex: /\b(strike)\b/gi, color: 'var(--brand-secondary)', weight: 600, tooltip: 'strike' }, // Strike with tooltip
    { regex: /\b(expiration date)\b/gi, color: 'var(--brand-secondary)', weight: 600, tooltip: 'expiration date' }, // Expiration date with tooltip
    { regex: /\b(underlying asset)\b/gi, color: 'var(--brand-secondary)', weight: 600 }, // Underlying asset in secondary
    { regex: /\b(premium)\b/gi, color: 'var(--brand-secondary)', weight: 600, tooltip: 'premium' }, // Premium in secondary
    { regex: /\b(Call|Put|Calls|Puts)\b/g, color: 'var(--brand-primary)', weight: 600, tooltip: true }, // Call/Put in primary
    { regex: /\b(exercise|exercised|exercising)\b/gi, color: 'var(--brand-primary)', weight: 600, tooltip: 'exercise' }, // Exercise in primary
  ];

  let result: Array<{ text: string; color?: string; weight?: number; tooltip?: string }> = [{ text }];

  patterns.forEach(({ regex, color, weight, tooltip }) => {
    const newResult: Array<{ text: string; color?: string; weight?: number; tooltip?: string }> = [];
    result.forEach((segment) => {
      if (segment.color) {
        // Already highlighted, keep as is
        newResult.push(segment);
      } else {
        // Use matchAll to find all matches with their positions
        const matches: Array<{ match: string; index: number }> = [];
        const regexCopy = new RegExp(regex.source, regex.flags);
        let match;
        
        // Reset regex
        regexCopy.lastIndex = 0;
        while ((match = regexCopy.exec(segment.text)) !== null) {
          matches.push({ match: match[0], index: match.index });
          // Prevent infinite loop on zero-length matches
          if (match[0].length === 0) {
            regexCopy.lastIndex++;
          }
        }
        
        if (matches.length === 0) {
          // No matches, keep original text
          newResult.push({ text: segment.text });
        } else {
          // Split text by matches
          let lastIndex = 0;
          matches.forEach(({ match: matchText, index }) => {
            // Add text before match
            if (index > lastIndex) {
              const beforeText = segment.text.substring(lastIndex, index);
              if (beforeText) {
                newResult.push({ text: beforeText });
              }
            }
            
            // Add matched text with styling
            const lowerMatch = matchText.toLowerCase();
            let tooltipKey: string | undefined;
            
            if (tooltip === true) {
              // For Call/Put, determine which one
              if (lowerMatch.includes('call')) {
                tooltipKey = 'call';
              } else if (lowerMatch.includes('put')) {
                tooltipKey = 'put';
              }
            } else if (typeof tooltip === 'string') {
              tooltipKey = tooltip;
            }
            
            newResult.push({ text: matchText, color, weight, tooltip: tooltipKey });
            lastIndex = index + matchText.length;
          });
          
          // Add remaining text after last match
          if (lastIndex < segment.text.length) {
            const afterText = segment.text.substring(lastIndex);
            if (afterText) {
              newResult.push({ text: afterText });
            }
          }
        }
      }
    });
    result = newResult;
  });

  return result.map((segment, idx) => {
    if (segment.color) {
      const style: React.CSSProperties = {
        color: segment.color,
        fontWeight: segment.weight,
        cursor: segment.tooltip ? 'help' : 'default',
      };
      
      if (segment.tooltip) {
        style.textDecoration = 'underline';
        style.textDecorationStyle = 'dotted';
        style.textDecorationThickness = '1px';
      }
      
      const styledSpan = (
        <span style={style}>
          {segment.text}
        </span>
      );
      
      if (segment.tooltip && tooltipDefinitions[segment.tooltip]) {
        return (
          <Tooltip key={idx} text={segment.text} definition={tooltipDefinitions[segment.tooltip]}>
            {styledSpan}
          </Tooltip>
        );
      }
      
      return <span key={idx}>{styledSpan}</span>;
    }
    return <span key={idx}>{segment.text}</span>;
  });
}

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
  const lessons = getLessons(levelId, courseId);
  
  // Find next lesson
  const currentLessonIndex = lessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1 
    ? lessons[currentLessonIndex + 1] 
    : null;

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
            <article style={{ display: 'grid', gap: '1.5rem', color: 'var(--text-secondary)' }}>
              {lesson.textContent.split('\n\n').map((paragraph, idx) => {
                // Skip empty paragraphs
                if (!paragraph.trim()) return null;
                
                // Check if paragraph contains bullet points
                const lines = paragraph.split('\n').filter(line => line.trim());
                const hasBullets = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
                
                // Detect special content types
                const isCoreInsight = paragraph.toLowerCase().includes('core insight');
                const isExample = paragraph.toLowerCase().includes('example') || paragraph.toLowerCase().includes('for example');
                const isKeySentence = paragraph.includes(':') && paragraph.length < 200 && paragraph.split(' ').length < 30;
                
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
                        <p style={{ margin: 0, marginBottom: '0.75rem', lineHeight: '1.7', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {introLines.join(' ')}
                        </p>
                      )}
                      {bulletItems.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'none' }}>
                          {bulletItems.map((item, itemIdx) => {
                            const cleanItem = item.replace(/^[•-]\s*/, '');
                            
                            return (
                              <li key={itemIdx} style={{ marginBottom: '0.75rem', position: 'relative', lineHeight: '1.7', fontSize: '1.05rem' }}>
                                <span style={{ position: 'absolute', left: '-1.5rem', color: 'var(--brand-primary)', fontSize: '1.2rem' }}>•</span>
                                <span>{highlightText(cleanItem)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                }
                
                // Regular paragraph - check if it's a heading
                const isHeading = paragraph.length < 100 && !paragraph.includes('.') && paragraph.split(' ').length < 10;
                
                // Enhanced formatting based on content type
                if (isCoreInsight) {
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem 1.5rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        margin: 0,
                      }}
                    >
                      <p style={{ margin: 0, lineHeight: '1.7', fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        <span style={{ color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Core Insight</span>
                        <br />
                        {paragraph.replace(/Core insight/gi, '').trim()}
                      </p>
                    </div>
                  );
                }
                
                if (isExample) {
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderLeft: '3px solid #10b981',
                        margin: 0,
                      }}
                    >
                      <p style={{ margin: 0, lineHeight: '1.7', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Example: </span>
                        {paragraph.replace(/For example,?/gi, '').replace(/Example:?/gi, '').trim()}
                      </p>
                    </div>
                  );
                }
                
                if (isKeySentence) {
                  return (
                    <div key={idx}>
                      <p style={{ margin: 0, lineHeight: '1.7', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {paragraph.split(':').map((part, partIdx, arr) => {
                          if (partIdx === 0 && arr.length > 1) {
                            return (
                              <span key={partIdx}>
                                <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{part}:</span>
                              </span>
                            );
                          }
                          return <span key={partIdx}>{part}</span>;
                        })}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div key={idx}>
                    {isHeading ? (
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: '0.75rem',
                          fontWeight: 700,
                          fontSize: '1.3rem',
                          color: 'var(--brand-primary)',
                          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {paragraph}
                      </h3>
                    ) : (
                      <p style={{ margin: 0, lineHeight: '1.7', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {highlightText(paragraph)}
                      </p>
                    )}
                  </div>
                );
              })}
            </article>
          )}

          <div className="badge-row">
            <span className="badge">Page #{lesson.order}</span>
            <span className="badge">{lesson.order === 1 ? 'Introduction' : 'Lesson'}</span>
          </div>
        </section>

        {lesson.questions && lesson.questions.length > 0 && (
          <section className="glass-card">
            <Quiz questions={lesson.questions as QuizQuestion[]} />
          </section>
        )}

        {nextLesson && (
          <section className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <Link
              href={`/levels/${levelId}/courses/${courseId}/lessons/${nextLesson.id}`}
              className="button-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                fontWeight: 600,
              }}
            >
              Next: {nextLesson.title}
              <span>→</span>
            </Link>
          </section>
        )}
      </main>

      <footer className="footer">Great traders review each lesson twice—once to learn it, once to own it.</footer>
    </div>
  );
}
