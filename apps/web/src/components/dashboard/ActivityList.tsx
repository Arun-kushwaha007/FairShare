import Link from 'next/link';
import { ActivityDto } from '@fairshare/shared-types';

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

export function ActivityList({ items, groupId }: { items: ActivityDto[]; groupId: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text-primary">Recent activity</h2>
        <Link
          href={`/dashboard/activity?groupId=${encodeURIComponent(groupId)}`}
          className="text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary"
        >
          View all
        </Link>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border/60 bg-surface/20 p-3">
            <p className="text-sm font-medium text-text-primary">{labelForType(item.type)}</p>
            <p className="mt-1 text-xs text-text-secondary">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {items.length === 0 ? <p className="text-sm text-text-secondary">No activity yet.</p> : null}
      </div>
    </div>
  );
}

