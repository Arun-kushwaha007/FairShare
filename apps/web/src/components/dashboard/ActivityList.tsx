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
    <div className="neo-border bg-zinc-900 p-8 shadow-[6px_6px_0px_0px_#ec4899]">
      <div className="flex items-center justify-between gap-3 mb-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">System Logs</h2>
        <Link
          href={`/dashboard/activity?groupId=${encodeURIComponent(groupId)}`}
          className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-pink-500 underline decoration-2 underline-offset-4 transition-colors"
        >
          Access Buffer
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="neo-border border-zinc-800 bg-black p-4 flex justify-between items-center group hover:border-pink-500 transition-colors">
            <div>
              <p className="text-sm font-black uppercase tracking-tighter text-white">{labelForType(item.type)}</p>
              <p className="text-[10px] font-mono font-bold uppercase text-zinc-600 mt-1">TIMESTAMP // {new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-zinc-800 group-hover:bg-pink-500 transition-colors" />
          </div>
        ))}
        {items.length === 0 ? <p className="text-sm font-mono font-bold uppercase text-zinc-700 text-center py-8">NO_DATA_FOUND</p> : null}
      </div>
    </div>
  );
}


