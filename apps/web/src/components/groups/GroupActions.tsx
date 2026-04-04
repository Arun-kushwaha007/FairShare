'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CurrencyCode, GroupDefaultSplitDto, GroupMemberSummaryDto } from '@fairshare/shared-types';
import Link from 'next/link';
import { Download, PlusCircle, Scale, Wallet } from 'lucide-react';
import dynamic from 'next/dynamic';
import { exportBalancesCsvAction, exportExpensesCsvAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

const CreateExpenseModal = dynamic(
  () => import('./CreateExpenseModal').then((mod) => mod.CreateExpenseModal),
  { ssr: false },
);

type GroupActionsProps = {
  groupId: string;
  currency: CurrencyCode;
  members: GroupMemberSummaryDto[];
  defaultSplitPreference?: GroupDefaultSplitDto | null;
};

export function GroupActions({
  groupId,
  currency,
  members,
  defaultSplitPreference,
}: GroupActionsProps) {
  const [open, setOpen] = useState(false);
  const [exportingExpenses, setExportingExpenses] = useState(false);
  const [exportingBalances, setExportingBalances] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const downloadCsv = (csv: string, fileName: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExpenseExport = async () => {
    try {
      setExportingExpenses(true);
      const result = await exportExpensesCsvAction(groupId);
      const csv = result.success ? (result.csv ?? '') : '';
      if (!csv) {
        throw new Error(result.success ? 'Failed to export expenses CSV' : result.message);
      }

      downloadCsv(csv, `fairshare-${groupId}.csv`);
      toast('Expenses CSV exported');
    } catch (error) {
      toast((error as Error).message || 'Failed to export expenses CSV', 'error');
    } finally {
      setExportingExpenses(false);
    }
  };

  const handleBalanceExport = async () => {
    try {
      setExportingBalances(true);
      const result = await exportBalancesCsvAction(groupId);
      const csv = result.success ? (result.csv ?? '') : '';
      if (!csv) {
        throw new Error(result.success ? 'Failed to export balances CSV' : result.message);
      }

      downloadCsv(csv, `fairshare-${groupId}-balances.csv`);
      toast('Balances CSV exported');
    } catch (error) {
      toast((error as Error).message || 'Failed to export balances CSV', 'error');
    } finally {
      setExportingBalances(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-4 shadow-[var(--fs-shadow-soft)] sm:p-6">
        <h3 className="mb-4 text-lg font-bold text-[var(--fs-text-primary)]">Actions</h3>
        <div className="grid gap-3">
          <button
            className="btn-royal inline-flex w-full items-center justify-center gap-2"
            onClick={() => setOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Record expense
          </button>
          <Link
            href={`/dashboard/groups/${groupId}/settle`}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]"
          >
            <Wallet className="h-4 w-4 text-[var(--fs-primary)]" />
            Settle up
          </Link>
          <button
            type="button"
            onClick={() => void handleExpenseExport()}
            disabled={exportingExpenses}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] disabled:opacity-60"
          >
            <Download className="h-4 w-4 text-[var(--fs-primary)]" />
            {exportingExpenses ? 'Exporting...' : 'Export expenses CSV'}
          </button>
          <button
            type="button"
            onClick={() => void handleBalanceExport()}
            disabled={exportingBalances}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] disabled:opacity-60"
          >
            <Scale className="h-4 w-4 text-[var(--fs-primary)]" />
            {exportingBalances ? 'Exporting...' : 'Export balances CSV'}
          </button>
          <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-medium text-[var(--fs-text-muted)]">
            Invite teammates from the member panel to keep your ledger accurate.
          </div>
        </div>
      </div>

      <CreateExpenseModal
        groupId={groupId}
        currency={currency}
        members={members}
        defaultSplitPreference={defaultSplitPreference}
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
