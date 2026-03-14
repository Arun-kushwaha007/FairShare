'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, UserPlus } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';
import { inviteMemberAction } from '../../lib/actions';

interface InviteModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteModal({ groupId, isOpen, onClose, onSuccess }: InviteModalProps) {
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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md pointer-events-auto overflow-hidden rounded-3xl border-4 border-white bg-black p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-400 rounded-xl">
                    <UserPlus className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Invite Member</h2>
                </div>
                <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors" title="Close">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      placeholder="e.g. friend@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white font-medium focus:border-cyan-400 focus:outline-none transition-all placeholder:text-zinc-600"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full bg-cyan-400 py-4 rounded-xl font-black uppercase italic tracking-tighter text-black transition-transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Invitation'}
                    </span>
                    <div className="absolute inset-0 rounded-xl border-4 border-black transition-transform group-hover:translate-x-1 group-hover:translate-y-1 -z-10 bg-white" />
                  </button>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600 text-center">
                    Invitation will be active immediately // non-users auto-join on signup
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
