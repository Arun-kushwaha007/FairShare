'use client';

import { useState } from 'react';
import { SimplifySuggestionDto } from '@fairshare/shared-types';
import { CheckCircle2, HandCoins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createSettlementAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

type SettlementListProps = {
  groupId: string;
  currency: string;
  suggestions: SimplifySuggestionDto[];
  memberLookup: Record<string, { name: string; email: string }>;
};

export function SettlementList({ groupId, currency, suggestions, memberLookup }: SettlementListProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const formatAmount = (cents: string) =>
    (Number(cents) / 100).toLocaleString(undefined, { style: 'currency', currency });

  const labelForUser = (userId: string) => memberLookup[userId]?.name ?? userId;

  const markSettled = async (suggestion: SimplifySuggestionDto) => {
    setPendingId(`${suggestion.fromUserId}-${suggestion.toUserId}-${suggestion.amountCents}`);
    const result = await createSettlementAction(groupId, {
      payerId: suggestion.fromUserId,
      receiverId: suggestion.toUserId,
      amountCents: suggestion.amountCents,
    });

    if (!result.success) {
      toast(result.message ?? 'Failed to record settlement', 'error');
      setPendingId(null);
      return;
    }

    toast('Settlement recorded');
    setPendingId(null);
    router.refresh();
  };

  if (suggestions.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-8 text-center shadow-[var(--fs-shadow-soft)]">
        <p className="text-lg font-bold text-[var(--fs-text-primary)] mb-1">All clear</p>
        <p className="text-sm font-medium text-[var(--fs-text-muted)]">No suggested settlements right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((item) => {
        const key = `${item.fromUserId}-${item.toUserId}-${item.amountCents}`;
        const pending = pendingId === key;
        return (
          <div
            key={key}
            className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 px-4 py-3 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--fs-text-primary)]">
                {labelForUser(item.fromUserId)} <span className="text-[var(--fs-text-muted)]">pays</span>{' '}
                {labelForUser(item.toUserId)}
              </p>
              <p className="text-[11px] font-medium text-[var(--fs-text-muted)]">{formatAmount(item.amountCents)}</p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
              onClick={() => void markSettled(item)}
              disabled={pending}
            >
              {pending ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[var(--fs-primary)]" />
                  Confirm
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
