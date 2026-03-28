'use client';

import { useMemo, useState } from 'react';
import {
  EXPENSE_CATEGORIES,
  RECURRING_EXPENSE_FREQUENCIES,
  RecurringExpenseDto,
  GroupMemberSummaryDto,
  type ExpenseCategory,
  type RecurringExpenseFrequency,
} from '@fairshare/shared-types';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteRecurringExpenseAction, updateRecurringExpenseAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

type RecurringExpenseListProps = {
  recurringExpenses: RecurringExpenseDto[];
  members: GroupMemberSummaryDto[];
  currency: string;
  onChanged?: () => void;
};

type RecurringSectionKey = 'overdue' | 'today' | 'upcoming';

const recurringLabels: Record<RecurringExpenseDto['frequency'], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const categoryLabels: Record<ExpenseCategory, string> = {
  FOOD: 'Food',
  TRAVEL: 'Travel',
  UTILITIES: 'Utilities',
  GROCERIES: 'Groceries',
  ENTERTAINMENT: 'Entertainment',
  OTHER: 'Other',
};

const sectionTitles: Record<RecurringSectionKey, string> = {
  overdue: 'Overdue',
  today: 'Due Today',
  upcoming: 'Upcoming',
};

function startOfToday(timestamp = Date.now()): number {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getRecurringSection(nextOccurrenceAt: string): RecurringSectionKey {
  const today = startOfToday();
  const next = startOfToday(new Date(nextOccurrenceAt).getTime());

  if (next < today) {
    return 'overdue';
  }
  if (next === today) {
    return 'today';
  }
  return 'upcoming';
}

function getRecurringStatus(nextOccurrenceAt: string): { label: string; className: string } {
  const section = getRecurringSection(nextOccurrenceAt);
  if (section === 'overdue') {
    return { label: 'Overdue', className: 'bg-rose-500/10 text-rose-500' };
  }
  if (section === 'today') {
    return { label: 'Due today', className: 'bg-amber-500/10 text-amber-500' };
  }
  return { label: 'Upcoming', className: 'bg-emerald-500/10 text-emerald-500' };
}

function formatGeneratedLabel(lastGeneratedAt?: string | null): string {
  if (!lastGeneratedAt) {
    return 'Not generated yet';
  }
  return `Last generated ${new Date(lastGeneratedAt).toLocaleDateString()}`;
}

export function RecurringExpenseList({ recurringExpenses, members, currency, onChanged }: RecurringExpenseListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [frequency, setFrequency] = useState<RecurringExpenseFrequency>('monthly');
  const { toast } = useToast();
  const memberNameById = useMemo(() => Object.fromEntries(members.map((member) => [member.userId, member.name])), [members]);

  const recurringSections = useMemo(() => {
    const grouped: Record<RecurringSectionKey, RecurringExpenseDto[]> = {
      overdue: [],
      today: [],
      upcoming: [],
    };

    [...recurringExpenses]
      .sort((a, b) => new Date(a.nextOccurrenceAt).getTime() - new Date(b.nextOccurrenceAt).getTime())
      .forEach((item) => {
        grouped[getRecurringSection(item.nextOccurrenceAt)].push(item);
      });

    return grouped;
  }, [recurringExpenses]);

  const startEdit = (item: RecurringExpenseDto) => {
    setEditingId(item.id);
    setDescription(item.description);
    setAmount((Number(item.totalAmountCents) / 100).toFixed(2));
    setCategory((item.category as ExpenseCategory | null) ?? '');
    setFrequency(item.frequency);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setCategory('');
    setFrequency('monthly');
  };

  const handleSave = async (recurringExpenseId: string) => {
    try {
      setSavingId(recurringExpenseId);
      const totalCents = Math.round(Number(amount || 0) * 100);
      if (!description.trim() || totalCents <= 0) {
        throw new Error('Enter a description and amount greater than zero');
      }

      const result = await updateRecurringExpenseAction(recurringExpenseId, {
        description: description.trim(),
        totalAmountCents: String(totalCents),
        category: category || null,
        frequency,
      });
      if (!result.success) {
        throw new Error(result.message);
      }

      toast('Recurring bill updated');
      cancelEdit();
      onChanged?.();
    } catch (error) {
      toast((error as Error).message || 'Failed to update recurring bill', 'error');
    } finally {
      setSavingId(null);
    }
  };

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

  const renderRecurringCard = (item: RecurringExpenseDto) => {
    const status = getRecurringStatus(item.nextOccurrenceAt);

    return (
      <div key={item.id} className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 p-4">
        {editingId === item.id ? (
          <div className="space-y-3">
            <input
              className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-3 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-3 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Amount"
              />
              <select
                className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-3 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                value={category}
                onChange={(event) => setCategory(event.target.value as ExpenseCategory | '')}
              >
                <option value="">No category</option>
                {EXPENSE_CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {categoryLabels[value]}
                  </option>
                ))}
              </select>
              <select
                className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-3 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                value={frequency}
                onChange={(event) => setFrequency(event.target.value as RecurringExpenseFrequency)}
              >
                {RECURRING_EXPENSE_FREQUENCIES.map((value) => (
                  <option key={value} value={value}>
                    {recurringLabels[value]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-[var(--fs-border)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)]">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave(item.id)}
                disabled={savingId === item.id}
                className="rounded-xl bg-[var(--fs-primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {savingId === item.id ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--fs-text-primary)]">{item.description}</h3>
                  <span className="rounded-full bg-[var(--fs-primary)]/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fs-primary)]">
                    {recurringLabels[item.frequency]}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--fs-text-muted)]">
                  Next run {new Date(item.nextOccurrenceAt).toLocaleDateString()} • Paid by {memberNameById[item.payerId] ?? 'Unknown'} • {item.splits.length} participants
                </p>
                <p className="mt-1 text-[12px] font-medium text-[var(--fs-text-muted)]">
                  {formatGeneratedLabel(item.lastGeneratedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-2 text-[var(--fs-text-primary)] transition-colors hover:border-[var(--fs-primary)]"
                  title="Edit recurring bill"
                >
                  <Pencil className="h-4 w-4" />
                </button>
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
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--fs-text-muted)]">Amount</span>
              <span className="text-lg font-extrabold text-[var(--fs-primary)]">
                {(Number(item.totalAmountCents) / 100).toLocaleString(undefined, { style: 'currency', currency })}
              </span>
            </div>
          </>
        )}
      </div>
    );
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

      <div className="mt-5 space-y-5">
        {recurringExpenses.length > 0 ? (
          (Object.keys(recurringSections) as RecurringSectionKey[]).map((sectionKey) =>
            recurringSections[sectionKey].length > 0 ? (
              <div key={sectionKey} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">{sectionTitles[sectionKey]}</h3>
                  <span className="text-[11px] font-bold text-[var(--fs-text-muted)]">{recurringSections[sectionKey].length}</span>
                </div>
                <div className="space-y-3">
                  {recurringSections[sectionKey].map(renderRecurringCard)}
                </div>
              </div>
            ) : null,
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--fs-border)] bg-[var(--fs-background)]/50 p-5 text-sm text-[var(--fs-text-muted)]">
            No recurring bills yet. Enable recurring when recording rent, utilities, or subscriptions.
          </div>
        )}
      </div>
    </section>
  );
}
