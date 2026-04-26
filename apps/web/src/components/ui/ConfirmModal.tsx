'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useModalFocusTrap } from './useModalFocusTrap';
import { Portal } from './Portal';

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isProcessing?: boolean;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isProcessing = false,
}: ConfirmModalProps) {
  const modalRef = useModalFocusTrap<HTMLDivElement>(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !isProcessing && onClose()}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-surface)] p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-modal-title"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                    isDestructive ? 'bg-rose-500/10 text-rose-500' : 'bg-[var(--fs-primary)]/10 text-[var(--fs-primary)]'
                  }`}
                >
                  <AlertTriangle size={32} />
                </div>
                <h3
                  id="confirm-modal-title"
                  className="text-xl font-black italic tracking-tighter text-[var(--fs-text-primary)] uppercase"
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm font-medium text-[var(--fs-text-muted)]">
                  {message}
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 rounded-xl bg-[var(--fs-bg)] py-3 font-bold tracking-widest text-[var(--fs-text-primary)] transition-colors hover:bg-[var(--fs-border)] uppercase text-xs disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className={`flex-1 rounded-xl py-3 font-bold tracking-widest text-white transition-colors disabled:opacity-50 uppercase text-xs ${
                    isDestructive
                      ? 'bg-rose-500 hover:bg-rose-600'
                      : 'bg-[var(--fs-primary)] hover:bg-purple-600'
                  }`}
                >
                  {isProcessing ? 'Processing...' : confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
