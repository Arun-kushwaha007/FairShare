'use client';

import Link from 'next/link';
import { AuthUserDto } from '@fairshare/shared-types';
import { LogOut, ShieldCheck, LifeBuoy, Settings } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

const cardBase = 'rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] shadow-[var(--fs-shadow-soft)]';

function initials(name?: string | null) {
  if (!name) return 'FS';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProfilePanel({ fallbackUser }: { fallbackUser: AuthUserDto | null }) {
  const { user, logout, loading } = useAuth();
  const currentUser = user ?? fallbackUser;

  return (
    <div className="space-y-8">
      <div className={`${cardBase} p-8 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-[var(--fs-primary)] to-[var(--fs-accent)]" />
        <div className="relative flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[var(--fs-primary)] text-white font-black text-2xl flex items-center justify-center shadow-lg border border-white/30">
            {initials(currentUser?.name)}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">
              {currentUser?.name ?? 'Guest'}
            </p>
            <p className="text-sm font-medium text-[var(--fs-text-muted)]">
              {currentUser?.email ?? 'Not signed in'}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-secondary)]">
              Parity with mobile profile, now on web.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/settings"
          className={`${cardBase} px-5 py-4 flex items-center gap-3 hover:border-[var(--fs-primary)] transition-colors`}
        >
          <div className="h-10 w-10 rounded-xl bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--fs-text-primary)]">Settings</p>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">Appearance, security, and account</p>
          </div>
        </Link>

        <div className={`${cardBase} px-5 py-4 flex items-center gap-3`}>
          <div className="h-10 w-10 rounded-xl bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--fs-text-primary)]">Privacy & security</p>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">Encryption, session hygiene, audit trails</p>
          </div>
        </div>

        <div className={`${cardBase} px-5 py-4 flex items-center gap-3`}>
          <div className="h-10 w-10 rounded-xl bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] flex items-center justify-center">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--fs-text-primary)]">Help & support</p>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">Troubleshooting and onboarding tips</p>
          </div>
        </div>

        <button
          onClick={() => void logout()}
          disabled={loading}
          className={`${cardBase} px-5 py-4 flex items-center gap-3 hover:border-rose-400/60 transition-colors`}
        >
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--fs-text-primary)]">Logout</p>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">Sign out on web just like mobile</p>
          </div>
          <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.12em] text-rose-400">
            {loading ? '...' : 'Exit'}
          </span>
        </button>
      </div>
    </div>
  );
}
