'use client';

import { useState } from 'react';
import { ExpenseDto } from '@fairshare/shared-types';
import dynamic from 'next/dynamic';

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

export function ExpenseRow({ expense, payerName }: { expense: ExpenseDto; payerName?: string }) {
  const [open, setOpen] = useState(false);

  const formatAmount = (cents: string): string => {
    const amount = Number(cents) / 100;
    return amount.toLocaleString(undefined, { style: 'currency', currency: expense.currency });
  };

  return (
    <>
      <tr className="hover:bg-[var(--fs-background)]/50 transition-colors group">
        <td className="px-6 py-4 text-base font-semibold text-[var(--fs-text-primary)]">
          <div className="space-y-1">
            <div>{expense.description}</div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">
              <span>{payerName ? `Paid by ${payerName}` : `Payer ${expense.payerId.slice(0, 6)}`}</span>
              {expense.category ? (
                <span className="rounded-full border border-[var(--fs-border)] bg-[var(--fs-background)] px-2 py-1 text-[10px] text-[var(--fs-text-primary)]">
                  {categoryLabels[expense.category] ?? expense.category}
                </span>
              ) : null}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-right text-base font-bold text-[var(--fs-primary)]">{formatAmount(expense.totalAmountCents)}</td>
        <td className="px-6 py-4 text-right text-[12px] font-medium text-[var(--fs-text-muted)] group-hover:text-[var(--fs-text-primary)] transition-colors">
          {new Date(expense.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
        </td>
        <td className="px-6 py-4 text-right">
          <button
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-xs font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
            onClick={() => setOpen(true)}
          >
            Upload receipt
          </button>
        </td>
      </tr>

      <ReceiptUploadModal expenseId={expense.id} open={open} onClose={() => setOpen(false)} onUploaded={() => setOpen(false)} />
    </>
  );
}
