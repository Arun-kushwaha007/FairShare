'use client';

import { useThemeMode } from './ThemeProvider';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { mode, resolved, setMode } = useThemeMode();

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-surface)] p-1 backdrop-blur-md shadow-sm">
      <button
        onClick={() => setMode('light')}
        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
          mode === 'light'
            ? 'bg-[var(--fs-primary)] text-white shadow-md'
            : 'text-[var(--fs-text-muted)] hover:bg-[var(--fs-primary)]/10 hover:text-[var(--fs-primary)]'
        }`}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setMode('dark')}
        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
          mode === 'dark'
            ? 'bg-[var(--fs-primary)] text-white shadow-md'
            : 'text-[var(--fs-text-muted)] hover:bg-[var(--fs-primary)]/10 hover:text-[var(--fs-primary)]'
        }`}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setMode('system')}
        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
          mode === 'system'
            ? 'bg-[var(--fs-primary)] text-white shadow-md'
            : 'text-[var(--fs-text-muted)] hover:bg-[var(--fs-primary)]/10 hover:text-[var(--fs-primary)]'
        }`}
        title="System Preference"
      >
        <Laptop size={16} />
      </button>
    </div>
  );
}
