'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/groups', label: 'Groups' },
  { href: '/dashboard/activity', label: 'Activity' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/settings', label: 'Settings' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:sticky md:top-6">
      <div className="neo-border bg-zinc-900 p-6 shadow-[4px_4px_0px_0px_#a855f7]">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-zinc-800">
          <Link href="/dashboard" className="text-xl font-black italic tracking-tighter uppercase">
            FAIRSHARE
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">v1.2.0</span>
        </div>

        <nav className="flex flex-col gap-2">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'relative group flex items-center justify-between border-2 px-4 py-3 text-sm font-black uppercase tracking-tighter transition-all',
                  active
                    ? 'border-white bg-white text-black translate-x-1 translate-y-1 shadow-[2px_2px_0px_0px_#22d3ee]'
                    : 'border-zinc-800 text-zinc-500 hover:border-white hover:text-white',
                ].join(' ')}
              >
                <span>{item.label}</span>
                {active && <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-12 bg-black neo-border p-4">
          <p className="text-[10px] font-mono font-bold uppercase tracking-tighter text-zinc-500 mb-2">SYSTEM STATUS:</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span className="text-xs font-mono font-bold text-green-400">NOMINAL</span>
          </div>
        </div>
      </div>
    </aside>
  );
}