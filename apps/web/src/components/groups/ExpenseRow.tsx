'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExpenseDto, formatCurrencyFromCents } from '@fairshare/shared-types';
import dynamic from 'next/dynamic';
import { ExpenseDeleteButton } from './ExpenseDeleteButton';

const ReceiptUploadModal = dynamic(() => import('./ReceiptUploadModal').then((mod) => mod.ReceiptUploadModal), {
  ssr: false,
});

const CreateExpenseModal = dynamic(() => import('./CreateExpenseModal').then((mod) => mod.CreateExpenseModal), {
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

/**
 * Render a table row displaying an expense with actions to view/edit, upload/replace a receipt, and delete.
 *
 * @param expense - The expense DTO to display.
 * @param payerName - Optional display name for the payer; when omitted a shortened payer ID is shown.
 * @param members - Member list forwarded to the edit modal.
 * @param isGuest - When true, disables action controls and renders the description as plain text.
 * @returns The table row and its associated modals as a JSX element.
 */
export function ExpenseRow({ 
  expense, 
  payerName, 
  members = [],
  isGuest = false,
}: { 
  expense: ExpenseDto; 
  payerName?: string;
  members?: any[];
  isGuest?: boolean;
}) {
  const [openReceipt, setOpenReceipt] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const formattedAmount = useMemo(() => {
    return formatCurrencyFromCents(expense.totalAmountCents, expense.currency);
  }, [expense.currency, expense.totalAmountCents]);

  return (
    <>
      <tr className="hover:bg-[var(--fs-background)]/50 transition-colors group">
        <td className="px-3 py-3 sm:px-6 sm:py-4 text-base font-semibold text-[var(--fs-text-primary)]">
          <div className="space-y-1">
            {isGuest ? (
              <span className="text-[var(--fs-text-primary)]">{expense.description}</span>
            ) : (
              <Link href={`/dashboard/expenses/${expense.id}`} className="hover:text-[var(--fs-primary)] transition-colors">
                {expense.description}
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">
              <span>{payerName ? `Paid by ${payerName}` : `Payer ${expense.payerId.slice(0, 6)}`}</span>
              {expense.category ? (
                <span className="rounded-full border border-[var(--fs-border)] bg-[var(--fs-background)] px-2 py-1 text-[10px] text-[var(--fs-text-primary)]">
                  {categoryLabels[expense.category] ?? expense.category}
                </span>
              ) : null}
              {expense.receiptFileKey ? (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-600">
                  Receipt attached
                </span>
              ) : null}
            </div>
          </div>
        </td>
        <td className="px-3 py-3 sm:px-6 sm:py-4 text-right text-base font-bold text-[var(--fs-primary)]">{formattedAmount}</td>
        <td className="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-right text-[12px] font-medium text-[var(--fs-text-muted)] group-hover:text-[var(--fs-text-primary)] transition-colors">
          {new Date(expense.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
        </td>
        <td className="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-right">
          {!isGuest && (
            <div className="flex items-center justify-end gap-2">
              <button
                className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-xs font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
                onClick={() => setOpenReceipt(true)}
              >
                {expense.receiptFileKey ? 'Replace receipt' : 'Upload receipt'}
              </button>
              <button
                className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-xs font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
                onClick={() => setOpenEdit(true)}
              >
                Edit
              </button>
              <ExpenseDeleteButton expenseId={expense.id} compact />
            </div>
          )}
        </td>
      </tr>

      <ReceiptUploadModal expenseId={expense.id} open={openReceipt} onClose={() => setOpenReceipt(false)} onUploaded={() => setOpenReceipt(false)} />
      <CreateExpenseModal 
        groupId={expense.groupId} 
        currency={expense.currency} 
        members={members as any} 
        expense={expense}
        open={openEdit} 
        onClose={() => setOpenEdit(false)} 
        onCreated={() => {
          setOpenEdit(false);
          window.location.reload(); // Refresh to show changes
        }} 
      />
    </>
  );
}
