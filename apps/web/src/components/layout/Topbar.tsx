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
    <header className="flex items-center justify-between gap-3 border-b-4 border-white bg-black p-6 mb-8">
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1 w-1 rounded-full bg-cyan-400 animate-ping" />
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            Secure Session Active // {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">{rightSlot}</div>
    </header>
  );
}