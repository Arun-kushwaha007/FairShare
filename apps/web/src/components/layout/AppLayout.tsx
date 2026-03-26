import { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-[var(--fs-background)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-0 h-32 w-32 sm:h-64 sm:w-64 rounded-full bg-[var(--fs-primary)]/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-36 w-36 sm:h-72 sm:w-72 rounded-full bg-[var(--fs-accent)]/10 blur-3xl" />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
