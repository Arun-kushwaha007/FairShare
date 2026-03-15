import Link from 'next/link';

export function QuickActions({ groupId }: { groupId?: string }) {
  return (
    <div className="card-royal p-8 brutal-accent-line bg-[var(--fs-surface)]">
      <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)] mb-6">Quick Override</h2>
      <div className="grid gap-3">
        <Link
          href="/dashboard/groups"
          className="group flex justify-between items-center px-4 py-3 bg-[var(--fs-background)] border border-[var(--fs-border)] rounded-xl text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-all"
        >
          <span>Browse Groups</span>
          <span className="text-[10px] font-bold text-[var(--fs-text-muted)] opacity-50 group-hover:opacity-100 transition-opacity">DIR</span>
        </Link>
        <Link
          href={groupId ? `/dashboard/groups/${encodeURIComponent(groupId)}` : '/dashboard/groups'}
          className="group flex justify-between items-center px-4 py-3 bg-[var(--fs-primary)]/5 border border-[var(--fs-primary)]/10 rounded-xl text-sm font-bold text-[var(--fs-primary)] hover:bg-[var(--fs-primary)]/10 transition-all"
        >
          <span>Open Active Group</span>
          <span className="text-[10px] font-bold text-[var(--fs-primary)] opacity-50 group-hover:opacity-100 transition-opacity">MOUNT</span>
        </Link>
        <Link
          href="/dashboard/activity"
          className="group flex justify-between items-center px-4 py-3 bg-[var(--fs-background)] border border-[var(--fs-border)] rounded-xl text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-accent)] transition-all"
        >
          <span>Activity Timeline</span>
          <span className="text-[10px] font-bold text-[var(--fs-text-muted)] opacity-50 group-hover:opacity-100 transition-opacity">LOGS</span>
        </Link>
      </div>
      
      <div className="mt-6 flex items-start gap-2 bg-[var(--fs-accent)]/10 p-3 rounded-lg border border-[var(--fs-accent)]/20">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--fs-accent)] mt-1" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fs-accent)] leading-relaxed">
          Info: Expense creation limited to active group views.
        </p>
      </div>
    </div>
  );
}
