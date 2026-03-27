'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecurringExpenseDto, GroupMemberSummaryDto } from '@fairshare/shared-types';
import { Trash2 } from 'lucide-react';
import { deleteRecurringExpenseAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

type RecurringExpenseListProps = {
  recurringExpenses: RecurringExpenseDto[];
  members: GroupMemberSummaryDto[];
  currency: string;
  onChanged?: () => void;
};

const recurringLabels: Record<RecurringExpenseDto['frequency'], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export function RecurringExpenseList({ recurringExpenses, members, currency, onChanged }: RecurringExpenseListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const memberNameById = useMemo(() => Object.fromEntries(members.map((member) => [member.userId, member.name])), [members]);

  const handleRemove = async (recurringExpenseId: string) => {
    const confirmed = window.confirm('Remove this recurring bill? Future auto-created expenses will stop.');
    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(recurringExpenseId);
      const result = await deleteRecurringExpenseAction(recurringExpenseId);
      if (!result.success) {
        throw new Error(result.message);
      }
      toast('Recurring bill removed');
      onChanged?.();
    } catch (error) {
      toast((error as Error).message || 'Failed to remove recurring bill', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 shadow-[var(--fs-shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Recurring</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Recurring bills</h2>
          <p className="mt-2 text-sm text-[var(--fs-text-muted)]">Keep fixed bills on autopilot without bloating the expense flow.</p>
        </div>
        <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Active</p>
          <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">{recurringExpenses.length}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {recurringExpenses.length > 0 ? (
          recurringExpenses.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--fs-text-primary)]">{item.description}</h3>
                    <span className="rounded-full bg-[var(--fs-primary)]/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fs-primary)]">
                      {recurringLabels[item.frequency]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--fs-text-muted)]">
                    Next run {new Date(item.nextOccurrenceAt).toLocaleDateString()} • Paid by {memberNameById[item.payerId] ?? 'Unknown'} • {item.splits.length} participants
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleRemove(item.id)}
                  disabled={removingId === item.id}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-500 transition-colors hover:bg-rose-500/20 disabled:opacity-60"
                  title="Remove recurring bill"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--fs-text-muted)]">Amount</span>
                <span className="text-lg font-extrabold text-[var(--fs-primary)]">
                  {(Number(item.totalAmountCents) / 100).toLocaleString(undefined, { style: 'currency', currency })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--fs-border)] bg-[var(--fs-background)]/50 p-5 text-sm text-[var(--fs-text-muted)]">
            No recurring bills yet. Enable recurring when recording rent, utilities, or subscriptions.
          </div>
        )}
      </div>
    </section>
  );
}
