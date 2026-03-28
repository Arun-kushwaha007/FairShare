import Link from 'next/link';

interface GroupCardProps {
  id: string;
  name: string;
  currency: string;
  memberCount: number;
  overdueRecurringCount?: number;
  balance?: {
    owe: string;
    owed: string;
  };
}

export function GroupCard({ id, name, currency, memberCount, overdueRecurringCount = 0, balance }: GroupCardProps) {
  return (
    <Link
      href={`/dashboard/groups/${id}`}
      className="group block card-royal p-4 sm:p-6 hover:border-[var(--fs-primary)] transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--fs-text-primary)] group-hover:text-[var(--fs-primary)] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] bg-[var(--fs-background)] px-2.5 py-1 rounded-md border border-[var(--fs-border)]">
              {memberCount} Members
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] bg-[var(--fs-background)] px-2.5 py-1 rounded-md border border-[var(--fs-border)]">
              {currency}
            </span>
            {overdueRecurringCount > 0 ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 dark:text-amber-400">
                {overdueRecurringCount} recurring due
              </span>
            ) : null}
          </div>
        </div>

        {balance && (
          <div className="text-right space-y-2">
            {parseFloat(balance.owed) > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Owed: {balance.owed}
              </div>
            )}
            {parseFloat(balance.owe) > 0 && (
              <div className="bg-crimson-500/10 border border-crimson-500/20 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400">
                Owe: {balance.owe}
              </div>
            )}
            {parseFloat(balance.owed) === 0 && parseFloat(balance.owe) === 0 && (
              <div className="bg-[var(--fs-background)] border border-[var(--fs-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--fs-text-muted)]">
                Settled
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
