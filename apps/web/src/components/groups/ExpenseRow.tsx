'use client';

import { useState } from 'react';
import { ExpenseDto } from '@fairshare/shared-types';
import dynamic from 'next/dynamic';

const ReceiptUploadModal = dynamic(
  () => import('./ReceiptUploadModal').then((mod) => mod.ReceiptUploadModal),
  { ssr: false },
);

export function ExpenseRow({ expense }: { expense: ExpenseDto }) {
  const [open, setOpen] = useState(false);

  const formatUsd = (cents: string): string => {
    const dollars = Number(cents) / 100;
    return dollars.toLocaleString(undefined, { style: 'currency', currency: expense.currency });
  };

  return (
    <>
      <tr className="hover:bg-[var(--fs-background)]/50 transition-colors group">
        <td className="px-6 py-4 text-base font-semibold text-[var(--fs-text-primary)]">
          {expense.description}
        </td>
        <td className="px-6 py-4 text-right text-base font-bold text-[var(--fs-primary)]">
          {formatUsd(expense.totalAmountCents)}
        </td>
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

      <ReceiptUploadModal
        expenseId={expense.id}
        open={open}
        onClose={() => setOpen(false)}
        onUploaded={() => setOpen(false)}
      />
    </>
  );
}
