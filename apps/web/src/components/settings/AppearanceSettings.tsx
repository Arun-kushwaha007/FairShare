'use client';

import type { JSX } from 'react';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useThemeMode } from '../theme/ThemeProvider';

type ThemeOption = {
  mode: 'light' | 'dark' | 'system';
  label: string;
  description: string;
  icon: JSX.Element;
};

const options: ThemeOption[] = [
  {
    mode: 'light',
    label: 'Light mode',
    description: 'Crisp ink on alabaster backgrounds for daytime focus.',
    icon: <Sun className="w-5 h-5" />,
  },
  {
    mode: 'dark',
    label: 'Dark mode',
    description: 'High-contrast text on graphite for night sessions.',
    icon: <Moon className="w-5 h-5" />,
  },
  {
    mode: 'system',
    label: 'System',
    description: 'Follow your device preference automatically.',
    icon: <Laptop className="w-5 h-5" />,
  },
];

export function AppearanceSettings() {
  const { mode, resolved, setMode } = useThemeMode();

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const active = mode === option.mode;
        return (
          <button
            key={option.mode}
            onClick={() => setMode(option.mode)}
            className={[
              'w-full text-left rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3 flex items-start gap-3 transition-all duration-200',
              active
                ? 'border-[var(--fs-primary)] shadow-[var(--fs-shadow-soft)] bg-[var(--fs-primary)]/8'
                : 'border-[var(--fs-border)] hover:border-[var(--fs-primary)] bg-[var(--fs-background)]/70',
            ].join(' ')}
            aria-pressed={active}
          >
            <div
              className={[
                'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                active ? 'bg-[var(--fs-primary)] text-white' : 'bg-[var(--fs-primary)]/10 text-[var(--fs-primary)]',
              ].join(' ')}
            >
              {option.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--fs-text-primary)] flex items-center gap-2">
                {option.label}
                {active ? (
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--fs-primary)]">
                    Active
                  </span>
                ) : null}
              </p>
              <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">{option.description}</p>
            </div>
            <div className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">
              {option.mode === 'system' ? `Now: ${resolved}` : ''}
            </div>
          </button>
        );
      })}
      <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] px-4 py-3 text-[12px] font-medium text-[var(--fs-text-secondary)]">
        Text and icon colors automatically contrast with the active background so content stays legible in light and dark themes.
      </div>
    </div>
  );
}
