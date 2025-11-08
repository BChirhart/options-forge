'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  const stored = window.localStorage.getItem('optionsforge-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = getPreferredTheme();
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', initial);
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('optionsforge-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    console.log('[ThemeProvider] theme applied:', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const listener = (event: MediaQueryListEvent) => {
      const preferred: Theme = event.matches ? 'light' : 'dark';
      setTheme((prev) => {
        const stored = window.localStorage.getItem('optionsforge-theme');
        if (stored === 'light' || stored === 'dark') {
          return prev;
        }
        return preferred;
      });
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
