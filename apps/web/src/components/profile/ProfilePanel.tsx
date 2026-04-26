'use client';

import Link from 'next/link';
import { AuthUserDto } from '@fairshare/shared-types';
import { LogOut, ShieldCheck, LifeBuoy, Settings, ChevronRight, User, Command } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '../ui/Toaster';
import { useState } from 'react';
import { deleteAccountAction } from '../../lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { toast } = useToast();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete my account') {
      toast('Please type "delete my account" to confirm', 'error');
      return;
    }
    
    setIsDeleting(true);
    try {
      const result = await deleteAccountAction();
      if (result.success) {
        toast('Account successfully scheduled for deletion');
        await logout();
      } else {
        toast(result.message || 'Failed to delete account', 'error');
      }
    } catch (err) {
      toast('An unexpected error occurred', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteConfirmation('');
    }
  };

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
      <GlassCard className="p-6 border-[var(--fs-border)] bg-[var(--fs-surface)] shadow-[var(--fs-shadow-soft)]">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--fs-primary)] to-[var(--fs-accent)] flex items-center justify-center shadow-lg border border-[var(--fs-border)]">
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-white">
              {initials(currentUser?.name)}
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter text-[var(--fs-text-primary)] uppercase">
              {currentUser?.name ?? 'Guest User'}
            </h1>
            <p className="text-sm font-bold tracking-widest text-[var(--fs-text-muted)] uppercase">
              {currentUser?.email ?? 'Not signed in'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── Actions ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/settings" className="block h-full">
          <GlassCard className="p-6 border-[var(--fs-border)] bg-[var(--fs-surface)] hover:bg-[var(--fs-primary)]/5 transition-all group flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] flex items-center justify-center border border-[var(--fs-primary)]/20">
              <Settings size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-[var(--fs-text-primary)] uppercase">Settings</p>
              <p className="text-[10px] font-semibold text-[var(--fs-text-muted)] uppercase tracking-widest">Account & Appearance</p>
            </div>
          </GlassCard>
        </Link>

        <div className="h-full">
          <GlassCard className="p-6 border-[var(--fs-border)] bg-[var(--fs-surface)] flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <ShieldCheck size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-[var(--fs-text-primary)] uppercase">Privacy & Security</p>
              <p className="text-[10px] font-bold text-[var(--fs-text-muted)] uppercase tracking-widest">Data & Encryption</p>
            </div>
          </GlassCard>
        </div>

        <div className="h-full">  
          <GlassCard className="p-6 border-[var(--fs-border)] bg-[var(--fs-surface)] flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-[var(--fs-text-muted)]/10 text-[var(--fs-text-muted)] flex items-center justify-center border border-[var(--fs-border)]">
              <LifeBuoy size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-[var(--fs-text-primary)] uppercase">Support</p>
              <p className="text-[10px] font-bold text-[var(--fs-text-muted)] uppercase tracking-widest">Help & Documentation</p>
            </div>
          </GlassCard>
        </div>

        <button
          onClick={() => void logout()}
          disabled={loading}
          className="w-full text-left h-full"
        >
          <GlassCard className="p-6 border-[var(--fs-border)] bg-[var(--fs-surface)] hover:bg-rose-500/5 hover:border-rose-500/20 transition-all group flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <LogOut size={18} />
            </div>
            <div className='pt-2'>
              <p className="text-sm font-black italic tracking-tight text-[var(--fs-text-primary)] uppercase">Logout</p>
              <p className="text-[10px] font-bold text-[var(--fs-text-muted)] uppercase tracking-widest">
                {loading ? 'Processing...' : 'Sign out of session'}
              </p>
            </div>
          </GlassCard>
        </button>
      </div>
      {/* ── Danger Zone ── */}
      <div className="pt-8">
        <GlassCard className="p-6 border-rose-500/20 bg-rose-500/5 shadow-[var(--fs-shadow-soft)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-lg font-black italic tracking-tighter text-rose-500 uppercase">
                Danger Zone
              </h2>
              <p className="text-[12px] font-medium text-[var(--fs-text-muted)] max-w-xl">
                Permanently delete your account and anonymize all associated personal data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={loading || isDeleting}
              className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold tracking-widest uppercase text-xs transition-colors"
            >
              Delete Account
            </button>
          </div>
        </GlassCard>
      </div>

      {/* ── Delete Account Modal ── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/20 bg-[var(--fs-surface)] p-6 shadow-2xl"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-black italic tracking-tighter text-[var(--fs-text-primary)] uppercase">
                  Delete Account
                </h3>
                <p className="mt-2 text-sm text-[var(--fs-text-muted)]">
                  This will permanently anonymize your data and remove your access to all groups. To proceed, please type <span className="font-bold text-rose-500">delete my account</span> below.
                </p>
              </div>

              <input
                type="text"
                placeholder="delete my account"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-bg)] px-4 py-3 text-center font-bold tracking-widest uppercase text-[var(--fs-text-primary)] outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 placeholder:text-[var(--fs-text-muted)]/50"
              />

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-[var(--fs-bg)] py-3 font-bold tracking-widest text-[var(--fs-text-primary)] transition-colors hover:bg-[var(--fs-border)] uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmation.toLowerCase() !== 'delete my account'}
                  className="flex-1 rounded-xl bg-rose-500 py-3 font-bold tracking-widest text-white transition-colors hover:bg-rose-600 disabled:opacity-50 uppercase text-xs"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
