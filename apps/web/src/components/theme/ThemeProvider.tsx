'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'fs-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  const resolved: ResolvedTheme = mode === 'system' ? getSystemTheme() : mode;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolved;
    document.body.dataset.theme = resolved;
  }
  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolved, setResolved] = useState<ResolvedTheme>('light');

  useEffect(() => {
    const readStored = (): ThemeMode => {
      if (typeof window === 'undefined') return 'system';
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system';
    };

    const stored = readStored();
    setModeState(stored);
    setResolved(applyTheme(stored));
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (mode === 'system') {
        setResolved(applyTheme('system'));
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [mode]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next);
    }
    setResolved(applyTheme(next));
  };

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
