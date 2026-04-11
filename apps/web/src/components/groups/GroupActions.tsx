'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CurrencyCode, GroupDefaultSplitDto, GroupMemberSummaryDto } from '@fairshare/shared-types';
import Link from 'next/link';
import { Download, PlusCircle, Scale, Share2, Wallet, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { exportBalancesCsvAction, exportExpensesCsvAction, toggleGroupShareAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

const CreateExpenseModal = dynamic(
  () => import('./CreateExpenseModal').then((mod) => mod.CreateExpenseModal),
  { ssr: false },
);

const DeleteGroupModal = dynamic(
  () => import('./DeleteGroupModal').then((mod) => mod.DeleteGroupModal),
  { ssr: false },
);

type GroupActionsProps = {
  groupId: string;
  groupName: string;
  currency: CurrencyCode;
  members: GroupMemberSummaryDto[];
  shareEnabled: boolean;
  shareToken?: string | null;
  defaultSplitPreference?: GroupDefaultSplitDto | null;
};

export function GroupActions({
  groupId,
  groupName,
  currency,
  members,
  shareEnabled,
  shareToken,
  defaultSplitPreference,
}: GroupActionsProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [exportingExpenses, setExportingExpenses] = useState(false);
  const [exportingBalances, setExportingBalances] = useState(false);
  const [togglingShare, setTogglingShare] = useState(false);
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

  const handleToggleShare = async () => {
    try {
      setTogglingShare(true);
      const result = await toggleGroupShareAction(groupId, !shareEnabled);
      if (!result.success) {
        throw new Error(result.message);
      }
      toast(shareEnabled ? 'Sharing disabled' : 'Sharing enabled');
      router.refresh();
    } catch (error) {
      toast((error as Error).message || 'Failed to toggle sharing', 'error');
    } finally {
      setTogglingShare(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${shareToken}` : '';

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast('Share URL copied to clipboard');
  };

  return (
    <>
      <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-4 shadow-[var(--fs-shadow-soft)] sm:p-6">
        <h3 className="mb-4 text-lg font-bold text-[var(--fs-text-primary)]">Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
          <button
            className="btn-royal inline-flex w-full items-center justify-center gap-2 sm:col-span-2 md:col-span-1"
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
          <button
            type="button"
            onClick={() => void handleToggleShare()}
            disabled={togglingShare}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] disabled:opacity-60"
          >
            <Share2 className="h-4 w-4 text-[var(--fs-primary)]" />
            {togglingShare ? 'Thinking...' : shareEnabled ? 'Disable public link' : 'Enable public link'}
          </button>
          
          {shareEnabled && shareToken && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <input 
                  readOnly 
                  aria-label="Group share link"
                  title="Group share link"
                  className="bg-transparent border-none text-[11px] font-mono text-[var(--fs-text-primary)] flex-1 focus:outline-none" 
                  value={shareUrl}
                />
                <button 
                  onClick={copyShareUrl}
                  className="text-[10px] font-bold uppercase text-indigo-400 hover:text-indigo-300"
                >
                  Copy
                </button>
              </div>
              <p className="px-1 text-[10px] font-medium text-[var(--fs-text-muted)] italic">
                Anyone with this link can view group expenses and balances.
              </p>
            </div>
          )}

          <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-3 text-sm font-medium text-[var(--fs-text-muted)]">
            Invite teammates from the member panel to keep your ledger accurate.
          </div>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete group
          </button>
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

      <DeleteGroupModal
        groupId={groupId}
        groupName={groupName}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
