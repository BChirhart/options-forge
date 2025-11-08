"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light or dark mode"
      className={`button-secondary theme-toggle-icon ${className}`.trim()}
    >
      <span aria-hidden>{isDark ? '🌙' : '☀️'}</span>
    </button>
  );
}
