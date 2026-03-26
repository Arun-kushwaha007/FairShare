import { ActivitySquare, LayoutGrid, Sparkles } from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';

export function QuickActions({ groupId }: { groupId?: string }) {
  const actions = [
    {
      title: 'Browse Groups',
      description: 'Create or join a crew to start splitting.',
      href: '/dashboard/groups',
      badge: 'Groups',
      icon: <LayoutGrid size={18} strokeWidth={2} />,
    },
    {
      title: 'Open Active Group',
      description: groupId ? 'Jump back into your primary group.' : 'Activate a group to unlock expenses.',
      href: groupId ? `/dashboard/groups/${encodeURIComponent(groupId)}` : '/dashboard/groups',
      badge: groupId ? 'Active' : 'Select',
      icon: <Sparkles size={18} strokeWidth={2} />,
      disabled: !groupId,
    },
    {
      title: 'Activity Timeline',
      description: 'Audit every change with a chronological log.',
      href: '/dashboard/activity',
      badge: 'Logs',
      icon: <ActivitySquare size={18} strokeWidth={2} />,
    },
  ];

  return (
    <div className="card-royal p-5 sm:p-8 brutal-accent-line bg-[var(--fs-surface)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Quick Actions</h2>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">2 min setup</span>
      </div>
      <div className="grid gap-3">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
      <div className="mt-6 flex items-start gap-2 bg-[var(--fs-accent)]/12 p-3 rounded-lg border border-[var(--fs-accent)]/20">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--fs-accent)] mt-1" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fs-text-primary)] leading-relaxed">
          Expense creation is available inside an active group. Jump in to start splitting.
        </p>
      </div>
    </div>
  );
}
