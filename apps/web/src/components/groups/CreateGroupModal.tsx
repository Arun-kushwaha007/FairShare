'use client';

import { useState } from 'react';
import { CurrencyCode } from '@fairshare/shared-types';
import { X, Sparkles } from 'lucide-react';
import { createGroupAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const currencyOptions: CurrencyCode[] = ['USD', 'EUR', 'INR'];

export function CreateGroupModal({ open, onClose, onCreated }: CreateGroupModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const submit = async () => {
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }
    setSaving(true);
    setError(null);
    const result = await createGroupAction({ name: name.trim(), currency });
    if (!result.success) {
      setError(result.message ?? 'Failed to create group');
      setSaving(false);
      return;
    }
    toast('Group created');
    setSaving(false);
    setName('');
    setCurrency('USD');
    onCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] shadow-[var(--fs-shadow-elevated)] p-6 relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Groups</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Create a group</h3>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
              Mirror the mobile flow: name and currency with strong contrast in both themes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--fs-background)] transition-colors text-[var(--fs-text-muted)]"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-[var(--fs-text-primary)]">Group name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Trip 2026"
              className="mt-2 w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-[var(--fs-text-primary)] font-semibold outline-none focus:border-[var(--fs-primary)]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[var(--fs-text-primary)]">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="mt-2 w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-[var(--fs-text-primary)] font-semibold outline-none focus:border-[var(--fs-primary)]"
            >
              {currencyOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>

          {error ? (
            <div className="rounded-xl border border-rose-400/60 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300">
              {error}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">
            <Sparkles className="w-4 h-4 text-[var(--fs-primary)]" />
            Mobile parity ensured
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-[var(--fs-border)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={() => void submit()}
              className="btn-royal text-sm px-5 py-2.5"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Create group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
