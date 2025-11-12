'use client';

import { useState } from 'react';

export interface QuizQuestion {
  question: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
}

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    // Don't allow changing answer after feedback is shown
    if (showFeedback[questionIndex]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));

    // Show feedback immediately
    setShowFeedback((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        Knowledge Check
      </h2>
      {questions.map((q, questionIndex) => {
        const selectedOption = selectedAnswers[questionIndex];
        const isAnswered = selectedOption !== null && selectedOption !== undefined;
        const feedbackShown = showFeedback[questionIndex];
        const selectedOptionData = isAnswered ? q.options[selectedOption] : null;
        const isCorrect = selectedOptionData?.isCorrect || false;

        return (
          <div
            key={questionIndex}
            style={{
              display: 'grid',
              gap: '1rem',
              padding: '1.5rem',
              borderRadius: '18px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface-color)',
            }}
          >
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {q.question}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {q.options.map((option, optionIndex) => {
                const isSelected = selectedOption === optionIndex;
                const showAsCorrect = feedbackShown && option.isCorrect;
                const showAsIncorrect = feedbackShown && isSelected && !option.isCorrect;

                const getButtonStyles = () => {
                  const baseStyles = {
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#ffffff',
                    cursor: feedbackShown ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    position: 'relative' as const,
                  };

                  if (showAsCorrect) {
                    return {
                      ...baseStyles,
                      background: '#10b981',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    };
                  }
                  if (showAsIncorrect) {
                    return {
                      ...baseStyles,
                      background: '#ef4444',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                    };
                  }
                  if (isSelected) {
                    return {
                      ...baseStyles,
                      background: 'var(--brand-primary)',
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                    };
                  }
                  return {
                    ...baseStyles,
                    background: 'var(--surface-strong)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                  };
                };

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                    disabled={feedbackShown}
                    style={getButtonStyles()}
                    onMouseEnter={(e) => {
                      if (!feedbackShown && !isSelected) {
                        e.currentTarget.style.background = 'var(--brand-primary)';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!feedbackShown && !isSelected) {
                        e.currentTarget.style.background = 'var(--surface-strong)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                    onMouseDown={(e) => {
                      if (!feedbackShown) {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!feedbackShown && !isSelected) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                  >
                    {showAsCorrect && (
                      <span style={{ fontSize: '1.1rem' }}>✓</span>
                    )}
                    {showAsIncorrect && (
                      <span style={{ fontSize: '1.1rem' }}>✗</span>
                    )}
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </div>
            {feedbackShown && selectedOptionData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                  color: isCorrect ? '#10b981' : '#ef4444',
                  fontWeight: 500,
                }}
              >
                {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                {selectedOptionData.feedback}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

