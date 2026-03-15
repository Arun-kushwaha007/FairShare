'use client';

import { usePathname } from 'next/navigation';

function titleFromPath(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname.startsWith('/dashboard/groups')) return 'Groups';
  if (pathname.startsWith('/dashboard/activity')) return 'Activity';
  if (pathname.startsWith('/dashboard/profile')) return 'Profile';
  if (pathname.startsWith('/dashboard/settings')) return 'Settings';
  return 'FairShare';
}

export function Topbar({ rightSlot }: { rightSlot?: React.ReactNode }) {
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  return (
    <header className="flex items-center justify-between p-6 mb-8 bg-transparent">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] opacity-50 shadow-[0_0_8px_var(--primary)]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Royal Session Active • {new Date().toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit'})}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">{rightSlot}</div>
    </header>
  );
}