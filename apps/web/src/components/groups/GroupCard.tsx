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
      className="group block rounded-2xl border border-border bg-card p-5 shadow-glass transition-all hover:bg-surface/10 backdrop-blur-glass"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand transition-colors">
            {name}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {memberCount} {memberCount === 1 ? 'member' : 'members'} • {currency}
          </p>
        </div>
        
        {balance && (
          <div className="text-right">
            {parseFloat(balance.owed) > 0 && (
              <p className="text-sm text-success font-medium">
                You are owed {balance.owed}
              </p>
            )}
            {parseFloat(balance.owe) > 0 && (
              <p className="text-sm text-danger font-medium mt-1">
                You owe {balance.owe}
              </p>
            )}
            {parseFloat(balance.owed) === 0 && parseFloat(balance.owe) === 0 && (
              <p className="text-sm text-text-secondary">Settle up</p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
