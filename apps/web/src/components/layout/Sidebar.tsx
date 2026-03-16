'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { glassPanel } from './layoutStyles';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/dashboard/groups', label: 'Groups', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/dashboard/activity', label: 'Activity', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/dashboard/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM12 15a3 3 0 100-6 3 3 0 000 6z' },
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
    <aside className="lg:sticky lg:top-10 h-fit">
      <div className={`${glassPanel} p-6 md:p-7 min-h-[520px] flex flex-col`}>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-12 h-12 relative overflow-hidden rounded-xl shadow-lg border border-white/20">
            <img 
              src="/logo.png" 
              alt="FairShare Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">FairShare</h2>
            <p className="text-[10px] font-bold text-[var(--fs-text-muted)] uppercase tracking-wider">Premium Edition</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 flex-grow">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold',
                  active
                    ? 'bg-[var(--fs-primary)] text-white shadow-lg'
                    : 'text-[var(--fs-text-secondary)] hover:bg-[var(--fs-primary)]/10 hover:text-[var(--fs-primary)]',
                ].join(' ')}
              >
                <svg
                  className={`w-5 h-5 ${active ? 'text-white' : 'text-[var(--fs-text-muted)] group-hover:text-[var(--fs-primary)]'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
                {active && (
                   <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Info */}
        <div className="mt-auto pt-6 border-t border-[var(--fs-border)]">
          <div className="bg-[var(--fs-background)] px-4 py-3 rounded-2xl border border-[var(--fs-border)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[var(--fs-text-muted)] uppercase">System</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Stable</span>
              </div>
            </div>
            <p className="text-xs font-bold text-[var(--fs-text-primary)]">FairShare v1.2.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
