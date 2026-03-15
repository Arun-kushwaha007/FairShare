import Link from 'next/link';

interface GroupCardProps {
  id: string;
  name: string;
  currency: string;
  memberCount: number;
  balance?: {
    owe: string;
    owed: string;
  };
}

export function GroupCard({ id, name, currency, memberCount, balance }: GroupCardProps) {
  return (
    <Link
      href={`/dashboard/groups/${id}`}
      className="group block card-royal p-6 hover:border-[var(--primary)] transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] bg-[var(--background)] px-2.5 py-1 rounded-md border border-[var(--border)]">
              {memberCount} Members
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] bg-[var(--background)] px-2.5 py-1 rounded-md border border-[var(--border)]">
              {currency}
            </span>
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
              <div className="bg-[var(--background)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--text-muted)]">
                Settled
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
