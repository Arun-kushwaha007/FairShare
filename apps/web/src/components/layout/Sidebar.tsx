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
      <div className="rounded-2xl border border-border bg-card p-4 shadow-glass backdrop-blur-glass">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-semibold tracking-wide text-text-primary">
            FairShare
          </Link>
          <span className="text-xs text-text-secondary">Web</span>
        </div>

        <nav className="mt-4 flex gap-1 overflow-x-auto md:flex-col md:gap-1.5 md:overflow-visible">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'whitespace-nowrap rounded-xl px-3 py-2 text-sm transition',
                  active
                    ? 'bg-white/10 text-text-primary'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}