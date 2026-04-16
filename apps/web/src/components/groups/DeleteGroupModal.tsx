'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Portal } from '../ui/Portal';
import { useModalFocusTrap } from '../ui/useModalFocusTrap';
import { deleteGroupAction } from '../../lib/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/Toaster';

type DeleteGroupModalProps = {
  groupId: string;
  groupName: string;
  open: boolean;
  onClose: () => void;
};

export function DeleteGroupModal({ groupId, groupName, open, onClose }: DeleteGroupModalProps) {
  const modalRef = useModalFocusTrap<HTMLDivElement>(open, onClose);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      const result = await deleteGroupAction(groupId);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast(`Group "${groupName}" deleted successfully`);
      onClose();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete group');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 py-10 bg-black/70 backdrop-blur-md">
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-group-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border-2 border-rose-500/20 bg-[var(--fs-card-solid)] p-6 sm:p-8 shadow-[0_20px_50px_rgba(244,63,94,0.15)] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 rounded-xl bg-[var(--fs-background)] hover:bg-[var(--fs-background)]/70 transition-colors text-[var(--fs-text-muted)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-center sm:text-left">
                <h3 id="delete-group-title" className="text-2xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">
                  Delete Group?
                </h3>
                <p className="text-sm font-medium text-[var(--fs-text-secondary)] leading-relaxed">
                  You are about to delete <span className="font-bold text-[var(--fs-text-primary)]">"{groupName}"</span>. 
                  This will permanently clear the group's expenses and balances.
                </p>
                <div className="rounded-xl bg-orange-500/5 border border-orange-500/10 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                    Note: Activity history will be preserved.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 text-xs font-semibold text-rose-600">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
                  disabled={isDeleting}
                >
                  Keep Group
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20 disabled:opacity-50"
                >
                  {isDeleting ? (
                    'Purging...'
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>

              {/* Ambient Red Glow */}
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-rose-500/5 blur-3xl" />
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}