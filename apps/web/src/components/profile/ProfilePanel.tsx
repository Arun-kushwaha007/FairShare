'use client';

import Link from 'next/link';
import { AuthUserDto } from '@fairshare/shared-types';
import { LogOut, ShieldCheck, LifeBuoy, Settings, ChevronRight, User, Command } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { motion } from 'framer-motion';
import { GlassCard } from '../../../components/ui/GlassCard';
import { fadeUp, staggerContainer } from '../../../components/home/motion-variants';

function initials(name?: string | null) {
  if (!name) return 'FS';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProfilePanel({ fallbackUser }: { fallbackUser: AuthUserDto | null }) {
  const { user, logout, loading } = useAuth();
  const currentUser = user ?? fallbackUser;

  const actionItems = [
    {
      title: 'Settings',
      desc: 'Appearance, security, and account syncing.',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Privacy',
      desc: 'Encryption keys and session hygiene.',
      icon: ShieldCheck,
      href: '#',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      title: 'Support',
      desc: 'Troubleshooting and interface onboarding.',
      icon: LifeBuoy,
      href: '#',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10'
    }
  ];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* ── User Identity ── */}
      <GlassCard className="p-6 border-white/10 bg-white/[0.02]">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-white">
              {initials(currentUser?.name)}
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase">
              {currentUser?.name ?? 'Guest User'}
            </h1>
            <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase">
              {currentUser?.email ?? 'Not signed in'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── Actions ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/settings" className="block h-full">
          <GlassCard className="p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Settings size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-white uppercase">Settings</p>
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Account & Appearance</p>
            </div>
          </GlassCard>
        </Link>

        <div className="h-full">
          <GlassCard className="p-6 border-white/5 bg-white/[0.01] flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <ShieldCheck size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-white uppercase">Privacy & Security</p>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Data & Encryption</p>
            </div>
          </GlassCard>
        </div>

        <div className="h-full">  
          <GlassCard className="p-6 border-white/5 bg-white/[0.01] flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-500/10 text-zinc-400 flex items-center justify-center border border-white/5">
              <LifeBuoy size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-white uppercase">Support</p>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Help & Documentation</p>
            </div>
          </GlassCard>
        </div>

        <button
          onClick={() => void logout()}
          disabled={loading}
          className="w-full text-left h-full"
        >
          <GlassCard className="p-6 border-white/5 bg-white/[0.01] hover:bg-rose-500/5 hover:border-rose-500/20 transition-all group flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <LogOut size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-white uppercase">Logout</p>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {loading ? 'Processing...' : 'Sign out of session'}
              </p>
            </div>
          </GlassCard>
        </button>
      </div>
    </motion.div>
  );
}
