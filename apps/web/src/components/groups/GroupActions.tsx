'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { PlusCircle } from 'lucide-react';
import { CreateExpenseModal } from './CreateExpenseModal';

type GroupActionsProps = {
  groupId: string;
  currency: string;
  members: GroupMemberSummaryDto[];
};

export function GroupActions({ groupId, currency, members }: GroupActionsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-6 shadow-[var(--fs-shadow-soft)]">
        <h3 className="text-lg font-bold text-[var(--fs-text-primary)] mb-4">Actions</h3>
        <div className="grid gap-3">
          <button
            className="btn-royal w-full inline-flex items-center justify-center gap-2"
            onClick={() => setOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Record expense
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
