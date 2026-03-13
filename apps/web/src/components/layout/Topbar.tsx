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
    <header className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary md:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your groups and shared expenses.</p>
      </div>
      <div className="flex items-center gap-2">{rightSlot}</div>
    </header>
  );
}