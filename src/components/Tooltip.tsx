'use client';

import { useState } from 'react';

interface TooltipProps {
  text: string;
  definition: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, definition, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '0.75rem 1rem',
            background: 'var(--surface-strong)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '200px',
            maxWidth: '300px',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            color: 'var(--text-primary)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--brand-primary)', fontSize: '0.95rem' }}>
            {text}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>{definition}</div>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--border-color)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%) translateY(-1px)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--surface-strong)',
            }}
          />
        </div>
      )}
    </span>
  );
}

