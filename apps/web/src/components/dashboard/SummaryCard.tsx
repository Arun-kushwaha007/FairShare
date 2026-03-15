import { ReactNode } from 'react';

export function SummaryCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="card-royal p-8 flex flex-col justify-between relative overflow-hidden">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-2">
          {title}
        </p>
        <div className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {value}
        </div>
      </div>
      
      {hint ? (
        <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
          <span className="text-xs font-semibold text-[var(--text-muted)]">
            {hint}
          </span>
        </div>
      ) : null}

      {/* Subtle Skeuomorphic Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/20 dark:bg-white/5" />
    </div>
  );
}
