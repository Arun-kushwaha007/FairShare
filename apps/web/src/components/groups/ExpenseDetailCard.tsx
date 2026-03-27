'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXPENSE_CATEGORIES, type ExpenseCategory, type ExpenseDto } from '@fairshare/shared-types';
import dynamic from 'next/dynamic';
import { Pencil } from 'lucide-react';
import { ExpenseDeleteButton } from './ExpenseDeleteButton';
import { updateExpenseAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

const ReceiptUploadModal = dynamic(() => import('./ReceiptUploadModal').then((mod) => mod.ReceiptUploadModal), {
  ssr: false,
});

const categoryLabels: Record<string, string> = {
  FOOD: 'Food',
  TRAVEL: 'Travel',
  UTILITIES: 'Utilities',
  GROCERIES: 'Groceries',
  ENTERTAINMENT: 'Entertainment',
  OTHER: 'Other',
};

export function ExpenseDetailCard({ expense, receiptUrl }: { expense: ExpenseDto; receiptUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(expense.description);
  const [category, setCategory] = useState<ExpenseCategory | ''>((expense.category as ExpenseCategory | null) ?? '');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const amount = (Number(expense.totalAmountCents) / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: expense.currency,
  });

  const saveEdit = async () => {
    if (!description.trim() || description.trim().length < 2) {
      toast('Description must be at least 2 characters', 'error');
      return;
    }

    try {
      setSaving(true);
      const result = await updateExpenseAction(expense.id, {
        description: description.trim(),
        category: category || null,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      toast('Expense updated');
      setEditing(false);
      router.refresh();
    } catch (error) {
      toast((error as Error).message || 'Failed to update expense', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 sm:p-8 shadow-[var(--fs-shadow-soft)] space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Expense detail</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">{expense.description}</h1>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">
              <span>Expense ID {expense.id.slice(0, 8)}</span>
              {expense.category ? (
                <span className="rounded-full border border-[var(--fs-border)] bg-[var(--fs-background)] px-2 py-1 text-[10px] text-[var(--fs-text-primary)]">
                  {categoryLabels[expense.category] ?? expense.category}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-5 py-4 text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Amount</p>
              <p className="text-2xl font-extrabold text-[var(--fs-primary)]">{amount}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] inline-flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                {editing ? 'Close Edit' : 'Edit'}
              </button>
              <ExpenseDeleteButton
                expenseId={expense.id}
                onDeleted={() => router.push(`/dashboard/groups/${expense.groupId}`)}
              />
            </div>
          </div>
        </div>

        {editing ? (
          <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/50 p-4 sm:p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--fs-text-primary)]">Description</label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] p-3 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--fs-text-primary)]">Category</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as ExpenseCategory | '')}
                className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] p-3 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
              >
                <option value="">No category</option>
                {EXPENSE_CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {categoryLabels[value]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDescription(expense.description);
                  setCategory((expense.category as ExpenseCategory | null) ?? '');
                  setEditing(false);
                }}
                className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveEdit()}
                disabled={saving}
                className="btn-royal px-5 py-2 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Date</p>
            <p className="mt-2 text-sm font-semibold text-[var(--fs-text-primary)]">
              {new Date(expense.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Currency</p>
            <p className="mt-2 text-sm font-semibold text-[var(--fs-text-primary)]">{expense.currency}</p>
          </div>
          <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Payer</p>
            <p className="mt-2 text-sm font-semibold text-[var(--fs-text-primary)]">{expense.payerId}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Receipt</h2>
              <p className="text-sm font-medium text-[var(--fs-text-muted)]">
                {expense.receiptFileKey ? 'Preview the attached receipt or replace it with a new upload.' : 'No receipt attached yet.'}
              </p>
            </div>
            <button onClick={() => setOpen(true)} className="btn-royal px-5 py-2">
              {expense.receiptFileKey ? 'Replace receipt' : 'Upload receipt'}
            </button>
          </div>

          {receiptUrl ? (
            <div className="overflow-hidden rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 p-3">
              <img src={receiptUrl} alt="Receipt preview" className="max-h-[28rem] w-full rounded-2xl object-contain" />
            </div>
          ) : expense.receiptFileKey ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-700">
              Receipt is attached, but no public S3 base URL is configured for web preview.
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/40 px-4 py-8 text-center text-sm font-medium text-[var(--fs-text-muted)]">
              Upload a receipt to keep proof alongside this expense.
            </div>
          )}
        </div>
      </div>

      <ReceiptUploadModal expenseId={expense.id} open={open} onClose={() => setOpen(false)} onUploaded={() => setOpen(false)} />
    </>
  );
}
