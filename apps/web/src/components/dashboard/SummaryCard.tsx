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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
      <p className="text-sm text-text-secondary">{title}</p>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
      {hint ? <div className="mt-2 text-sm text-text-secondary">{hint}</div> : null}
    </div>
  );
}

