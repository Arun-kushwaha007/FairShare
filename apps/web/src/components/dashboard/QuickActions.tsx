import Link from 'next/link';

export function QuickActions({ groupId }: { groupId?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
      <h2 className="text-base font-semibold text-text-primary">Quick actions</h2>
      <div className="mt-4 grid gap-2">
        <Link
          href="/dashboard/groups"
          className="rounded-xl border border-border/60 bg-surface/20 px-4 py-3 text-sm text-text-primary hover:bg-white/5"
        >
          Browse groups
        </Link>
        <Link
          href={groupId ? `/dashboard/groups/${encodeURIComponent(groupId)}` : '/dashboard/groups'}
          className="rounded-xl border border-border/60 bg-surface/20 px-4 py-3 text-sm text-text-primary hover:bg-white/5"
        >
          Open group
        </Link>
        <Link
          href="/dashboard/activity"
          className="rounded-xl border border-border/60 bg-surface/20 px-4 py-3 text-sm text-text-primary hover:bg-white/5"
        >
          Activity timeline
        </Link>
      </div>
      <p className="mt-3 text-xs text-text-secondary">Expense creation lands in the Groups view.</p>
    </div>
  );
}

