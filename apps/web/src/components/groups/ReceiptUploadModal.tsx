'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileUp, X } from 'lucide-react';
import { createReceiptUrlAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';
import { useModalFocusTrap } from '../ui/useModalFocusTrap';

type ReceiptUploadModalProps = {
  expenseId: string;
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
};

export function ReceiptUploadModal({
  expenseId,
  open,
  onClose,
  onUploaded,
}: ReceiptUploadModalProps) {
  const modalRef = useModalFocusTrap<HTMLDivElement>(open, onClose);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onFileChange = (selected?: File) => {
    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      setError('');
      return;
    }

    // Validation: 5MB limit
    if (selected.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    // Validation: Type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(selected.type)) {
      setError('Unsupported file type. Please upload JPG, PNG, WebP or PDF.');
      return;
    }

    setError('');
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const upload = async () => {
    if (!file) {
      setError('Select a receipt image first.');
      return;
    }
    setError('');
    setUploading(true);

    const extension = file.name.split('.').pop();
    const presign = await createReceiptUrlAction(expenseId, extension);
    if (!presign.success || !presign.presign?.uploadUrl) {
      setError(presign.message ?? 'Could not get upload URL');
      setUploading(false);
      return;
    }

    const response = await fetch(presign.presign.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    }).catch(() => null);

    if (!response || !response.ok) {
      setError('Upload failed. Please try again.');
      setUploading(false);
      return;
    }

    toast('Receipt uploaded');
    setUploading(false);
    onUploaded?.();
    onClose();
    onFileChange(undefined);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="receipt-upload-title"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] shadow-[var(--fs-shadow-elevated)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--fs-border)]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">
                    Receipt
                  </p>
                  <h3
                    id="receipt-upload-title"
                    className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]"
                  >
                    Upload proof
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close upload modal"
                  title="Close upload modal"
                  className="p-2 rounded-lg bg-[var(--fs-background)] hover:bg-[var(--fs-background)]/70 transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--fs-text-muted)]" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--fs-border)] bg-[var(--fs-background)]/50 px-4 py-8 cursor-pointer hover:border-[var(--fs-primary)] transition-colors">
                  <FileUp className="w-8 h-8 text-[var(--fs-primary)]" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[var(--fs-text-primary)]">
                      Choose an image or PDF
                    </p>
                    <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
                      PNG, JPG, or PDF up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => onFileChange(e.target.files?.[0])}
                  />
                </label>

                {previewUrl ? (
                  <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)] p-3">
                    <p className="text-xs font-semibold text-[var(--fs-text-muted)] mb-2">
                      Preview
                    </p>
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="max-h-72 w-full object-contain rounded-xl"
                    />
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600">
                    {error}
                  </div>
                ) : null}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void upload()}
                    className="btn-royal px-6 py-2"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload receipt'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
