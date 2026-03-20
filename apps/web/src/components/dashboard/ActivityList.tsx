import Link from 'next/link';
import { ActivityDto } from '@fairshare/shared-types';
import { Clock } from 'lucide-react';
import { glassPanel } from '../layout/layoutStyles';

function labelForType(type: ActivityDto['type']): string {
  switch (type) {
    case 'expense_created':
      return 'Expense created';
    case 'expense_updated':
      return 'Expense updated';
    case 'expense_deleted':
      return 'Expense deleted';
    case 'settlement_created':
      return 'Settlement created';
    case 'member_joined':
      return 'Member joined';
    case 'member_invited':
      return 'Member invited';
    default:
      return 'Activity';
  }
}

export function ActivityList({ items = [], groupId = '' }: { items?: ActivityDto[]; groupId?: string }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className={`${glassPanel} p-7`}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Recent Activity</h2>
        <Link
          href={`/dashboard/activity?groupId=${encodeURIComponent(groupId)}`}
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)] hover:text-[var(--fs-primary)] transition-colors"
        >
          View timeline
        </Link>
      </div>

      <div className="space-y-3">
        {safeItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 px-4 py-3 hover:border-[var(--fs-primary)] transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--fs-text-primary)]">{labelForType(item.type)}</p>
              <p className="text-[11px] font-medium text-[var(--fs-text-muted)] flex items-center gap-2">
                <Clock size={14} strokeWidth={2} />
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fs-primary)] bg-[var(--fs-primary)]/10 px-3 py-1 rounded-lg">
              {item.type.replace('_', ' ')}
            </span>
          </div>
        ))}

        {safeItems.length === 0 ? (
          <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/50 px-6 py-8 text-center">
            <p className="text-sm font-semibold text-[var(--fs-text-primary)] mb-1">No activity yet</p>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
              Refresh after new expenses or settlements to see the latest activity.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
