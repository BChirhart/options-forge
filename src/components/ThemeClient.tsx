'use client';

import { ThemeProvider } from './ThemeProvider';

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
