import Link from 'next/link';
import { ReactNode } from 'react';

type QuickActionCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export function QuickActionCard({ title, description, href, badge, icon, disabled }: QuickActionCardProps) {
  const content = (
    <div
      className={[
        'flex items-center justify-between gap-4 rounded-2xl border border-[var(--fs-border)]',
        'bg-[var(--fs-background)]/70 px-3 py-2 sm:px-4 sm:py-3 transition-all duration-200',
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-[var(--fs-primary)] hover:-translate-y-[1px]',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="h-9 w-9 rounded-xl bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] flex items-center justify-center">
            {icon}
          </div>
        ) : null}
        <div>
          <p className="text-sm font-semibold text-[var(--fs-text-primary)]">{title}</p>
          <p className="text-[11px] font-medium text-[var(--fs-text-muted)] hidden sm:block">{description}</p>
        </div>
      </div>
      {badge ? (
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg bg-[var(--fs-accent)]/15 text-[var(--fs-text-primary)] border border-[var(--fs-border)]">
          {badge}
        </span>
      ) : null}
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
