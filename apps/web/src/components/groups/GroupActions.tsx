'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CurrencyCode, GroupDefaultSplitDto, GroupMemberSummaryDto } from '@fairshare/shared-types';
import Link from 'next/link';
import { Download, PlusCircle, Wallet } from 'lucide-react';
import dynamic from 'next/dynamic';
import { exportExpensesCsvAction } from '../../lib/actions';
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

export function GroupActions({ groupId, currency, members, defaultSplitPreference }: GroupActionsProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setExporting(true);
      const result = await exportExpensesCsvAction(groupId);
      const csv = result.success ? result.csv ?? '' : '';
      if (!csv) {
        throw new Error(result.success ? 'Failed to export CSV' : result.message);
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `fairshare-${groupId}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast('CSV exported');
    } catch (error) {
      toast((error as Error).message || 'Failed to export CSV', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-4 sm:p-6 shadow-[var(--fs-shadow-soft)]">
        <h3 className="text-lg font-bold text-[var(--fs-text-primary)] mb-4">Actions</h3>
        <div className="grid gap-3">
          <button className="btn-royal w-full inline-flex items-center justify-center gap-2" onClick={() => setOpen(true)}>
            <PlusCircle className="w-4 h-4" />
            Record expense
          </button>
          <Link
            href={`/dashboard/groups/${groupId}/settle`}
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] flex items-center gap-2 justify-center"
          >
            <Wallet className="w-4 h-4 text-[var(--fs-primary)]" />
            Settle up
          </Link>
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Download className="w-4 h-4 text-[var(--fs-primary)]" />
            {exporting ? 'Exporting...' : 'Export CSV'}
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
