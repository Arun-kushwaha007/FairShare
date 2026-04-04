'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, UserPlus } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';
import { inviteMemberAction } from '../../lib/actions';
import { useModalFocusTrap } from '../ui/useModalFocusTrap';

interface InviteModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteModal({ groupId, isOpen, onClose, onSuccess }: InviteModalProps) {
  const modalRef = useModalFocusTrap<HTMLDivElement>(isOpen, onClose);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast('Please enter an email address', 'error');
      return;
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await inviteMemberAction(groupId, trimmedEmail);

      if (result.success) {
        toast('Invitation sent successfully!', 'success');
        setEmail('');
        onSuccess();
        onClose();
      } else {
        toast(result.message, 'error');
      }
    } catch (error) {
      toast('An unexpected error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="invite-member-title"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md pointer-events-auto overflow-hidden rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-surface)] p-10 shadow-[var(--fs-shadow-elevated)]"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-[var(--fs-primary)]/10 rounded-2xl">
                    <UserPlus className="w-6 h-6 text-[var(--fs-primary)]" />
                  </div>
                  <div>
                    <h2
                      id="invite-member-title"
                      className="text-2xl font-extrabold tracking-tight text-[var(--fs-text-primary)]"
                    >
                      Invite Member
                    </h2>
                    <p className="text-xs font-bold text-[var(--fs-text-muted)] uppercase tracking-wider mt-0.5">
                      Royal Invitation
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 text-[var(--fs-text-muted)] hover:text-[var(--fs-text-primary)] hover:bg-[var(--fs-background)] rounded-xl transition-all"
                  title="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--fs-text-secondary)] ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fs-text-muted)] group-focus-within:text-[var(--fs-primary)] transition-colors" />
                    <input
                      data-autofocus="true"
                      type="email"
                      placeholder="e.g. friend@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--fs-background)] border border-[var(--fs-border)] rounded-2xl py-4.5 pl-12 pr-4 text-[var(--fs-text-primary)] font-semibold focus:border-[var(--fs-primary)] focus:outline-none transition-all placeholder:text-[var(--fs-text-muted)]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-royal w-full flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Send Invitation'
                    )}
                  </button>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fs-text-muted)] text-center opacity-80">
                    Invitation will be active immediately • Non-users auto-join on signup
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
