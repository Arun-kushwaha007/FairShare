'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CurrencyCode,
  EXPENSE_CATEGORIES,
  EXPENSE_SPLIT_TYPES,
  ExpenseCategory,
  ExpenseDto,
  ExpenseSplitType,
  GroupDefaultSplitDto,
  GroupMemberSummaryDto,
  RECURRING_EXPENSE_FREQUENCIES,
  RecurringExpenseFrequency,
} from '@fairshare/shared-types';
import { Sparkles, X } from 'lucide-react';
import { createExpenseAction, updateExpenseAction, updateGroupDefaultSplitAction } from '../../lib/actions';
import { equalShares, exactShares, percentageShares, sumShares } from '../../lib/split';
import { useToast } from '../ui/Toaster';
import { useModalFocusTrap } from '../ui/useModalFocusTrap';
import { Portal } from '../ui/Portal';

type CreateExpenseModalProps = {
  groupId: string;
  currency: CurrencyCode;
  members: GroupMemberSummaryDto[];
  defaultSplitPreference?: GroupDefaultSplitDto | null;
  expense?: ExpenseDto | null;
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const categoryLabels: Record<ExpenseCategory, string> = {
  FOOD: 'Food',
  TRAVEL: 'Travel',
  UTILITIES: 'Utilities',
  GROCERIES: 'Groceries',
  ENTERTAINMENT: 'Entertainment',
  OTHER: 'Other',
};

const recurringLabels: Record<RecurringExpenseFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export function CreateExpenseModal({
  groupId,
  currency,
  members,
  defaultSplitPreference,
  expense,
  open,
  onClose,
  onCreated,
}: CreateExpenseModalProps) {
  const modalRef = useModalFocusTrap<HTMLDivElement>(open, onClose);
  const allMemberIds = useMemo(() => members.map((member) => member.userId), [members]);
  const defaultPayer = members[0]?.userId ?? '';
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringFrequency, setRecurringFrequency] =
    useState<RecurringExpenseFrequency>('monthly');
  const [payerId, setPayerId] = useState(defaultPayer);
  const [splitType, setSplitType] = useState<ExpenseSplitType>('equal');
  const [participants, setParticipants] = useState<string[]>(allMemberIds);
  const [exactByUser, setExactByUser] = useState<Record<string, string>>({});
  const [percentagesByUser, setPercentagesByUser] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (expense) {
      setDescription(expense.description);
      setAmount((Number(expense.totalAmountCents) / 100).toString());
      setCategory(expense.category || '');
      setPayerId(expense.payerId);
      setSplitType('equal'); // Defaulting to equal for now when editing complex splits if not tracked
      setParticipants(expense.splits?.map((s) => s.userId) || allMemberIds);
      // Note: Full split reconstruction (exact/percentage) is complex without split metadata,
      // but for basic hardening we allow editing description/amount/payer.
      return;
    }

    setPayerId(defaultPayer);
    setRecurringEnabled(false);
    setRecurringFrequency('monthly');
    setDescription('');
    setAmount('');
    setCategory('');

    const fallbackParticipants = allMemberIds;
    if (!defaultSplitPreference) {
      setSplitType('equal');
      setParticipants(fallbackParticipants);
      setExactByUser({});
      setPercentagesByUser({});
      return;
    }

    const preferredParticipants = defaultSplitPreference.participantUserIds.filter((userId) =>
      allMemberIds.includes(userId),
    );
    const nextParticipants =
      preferredParticipants.length > 0 ? preferredParticipants : fallbackParticipants;
    const nextExact: Record<string, string> = {};
    const nextPercentages: Record<string, string> = {};

    nextParticipants.forEach((userId) => {
      if (defaultSplitPreference.exactAmountsCentsByUser?.[userId]) {
        nextExact[userId] = defaultSplitPreference.exactAmountsCentsByUser[userId];
      }
      if (defaultSplitPreference.percentagesByUser?.[userId]) {
        nextPercentages[userId] = defaultSplitPreference.percentagesByUser[userId];
      }
    });

    setSplitType(defaultSplitPreference.splitType);
    setParticipants(nextParticipants);
    setExactByUser(nextExact);
    setPercentagesByUser(nextPercentages);
  }, [allMemberIds, defaultPayer, defaultSplitPreference, open]);

  useEffect(() => {
    if (payerId && !participants.includes(payerId)) {
      setParticipants((prev) => [...prev, payerId]);
    }
  }, [payerId, participants]);

  const participantOptions = useMemo(
    () =>
      members.map((member) => ({
        id: member.userId,
        name: member.name,
        email: member.email,
        role: member.role,
      })),
    [members],
  );

  const toggleParticipant = (userId: string) => {
    if (userId === payerId) {
      return;
    }

    setParticipants((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId],
    );
  };

  const buildDefaultSplitPreference = (
    nextSplitType: ExpenseSplitType,
    nextParticipants: string[],
  ): GroupDefaultSplitDto => ({
    splitType: nextSplitType,
    participantUserIds: Array.from(new Set(nextParticipants)),
    exactAmountsCentsByUser: nextSplitType === 'exact' ? exactByUser : undefined,
    percentagesByUser: nextSplitType === 'percentage' ? percentagesByUser : undefined,
  });

  const saveDefaultSplit = async (nextPreference: GroupDefaultSplitDto) => {
    try {
      setSavingDefault(true);
      const result = await updateGroupDefaultSplitAction(groupId, {
        defaultSplitPreference: nextPreference,
      });
      if (!result.success) {
        throw new Error(result.message);
      }
      toast('Default split saved');
      onCreated?.();
    } catch (err) {
      setError((err as Error).message || 'Unable to save default split');
    } finally {
      setSavingDefault(false);
    }
  };

  const resetDefaultSplit = async () => {
    const nextParticipants = allMemberIds.length > 0 ? allMemberIds : participants;
    setSplitType('equal');
    setParticipants(nextParticipants);
    setExactByUser({});
    setPercentagesByUser({});
    await saveDefaultSplit({
      splitType: 'equal',
      participantUserIds: nextParticipants,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const totalCents = Math.round(Number(amount || 0) * 100);

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (description.length > 255) {
      setError('Description cannot exceed 255 characters.');
      return;
    }

    if (totalCents <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (participants.length === 0) {
      setError('Select at least one participant.');
      return;
    }

    let shares: Record<string, number>;
    try {
      if (splitType === 'equal') {
        shares = equalShares(totalCents, participants);
      } else if (splitType === 'exact') {
        shares = exactShares(participants, exactByUser);
      } else {
        shares = percentageShares(totalCents, participants, percentagesByUser);
      }

      const diff = totalCents - sumShares(shares);
      if (diff !== 0 && participants.length > 0) {
        shares[participants[0]] = (shares[participants[0]] ?? 0) + diff;
      }
    } catch (err) {
      setError((err as Error).message || 'Invalid split configuration.');
      return;
    }

    const splits = participants.map((userId) => ({
      userId,
      owedAmountCents: String(shares[userId] ?? 0),
      paidAmountCents: userId === payerId ? String(totalCents) : '0',
    }));

    try {
      setSubmitting(true);
      if (expense) {
        const result = await updateExpenseAction(expense.id, {
          description: description.trim(),
          category: (category || null) as ExpenseCategory | null,
        });
        if (!result.success) throw new Error(result.message);
        toast('Expense updated');
      } else {
        const result = await createExpenseAction(groupId, {
          payerId,
          description: description.trim(),
          totalAmountCents: String(totalCents),
          currency,
          category: category || undefined,
          recurring: recurringEnabled ? { frequency: recurringFrequency } : undefined,
          splits,
        });
        if (!result.success) throw new Error(result.message);
        toast('Expense recorded');
      }
      onCreated?.();
      onClose();
      setDescription('');
      setAmount('');
      setCategory('');
      setRecurringEnabled(false);
      setRecurringFrequency('monthly');
    } catch (err) {
      setError((err as Error).message || 'Unable to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 py-8 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-3xl">
              <motion.div
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-expense-title"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card-solid)] shadow-[var(--fs-shadow-elevated)] overflow-hidden"
              >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--fs-border)]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">
                    Expense
                  </p>
                  <h3
                    id="create-expense-title"
                    className="text-2xl font-extrabold tracking-tight text-[var(--fs-text-primary)]"
                  >
                    {expense ? 'Edit expense' : 'Record new expense'}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-[var(--fs-background)] hover:bg-[var(--fs-background)]/70 transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--fs-text-muted)]" />
                </button>
              </div>

              <form
                className="grid gap-6 px-6 py-6 md:grid-cols-[2fr_1.2fr]"
                onSubmit={handleSubmit}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--fs-text-primary)]">
                      Description
                    </label>
                    <input
                      data-autofocus="true"
                      className="w-full rounded-xl border-2 border-[var(--fs-border)] bg-[var(--fs-surface)] p-3 text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)] placeholder:text-[var(--fs-text-muted)]/50"
                      placeholder="Team dinner, rideshare..."
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--fs-text-primary)]">
                        Amount ({currency})
                      </label>
                      <input
                        className="w-full rounded-xl border-2 border-[var(--fs-border)] bg-[var(--fs-surface)] p-3 text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--fs-text-primary)]">
                        Payer
                      </label>
                      <select
                        className="w-full rounded-xl border-2 border-[var(--fs-border)] bg-[var(--fs-surface)] p-3 text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                        value={payerId}
                        onChange={(event) => setPayerId(event.target.value)}
                      >
                        {participantOptions.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--fs-text-primary)]">
                        Category
                      </label>
                      <select
                        className="w-full rounded-xl border-2 border-[var(--fs-border)] bg-[var(--fs-surface)] p-3 text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                        value={category}
                        onChange={(event) =>
                          setCategory(event.target.value as ExpenseCategory | '')
                        }
                      >
                        <option value="">No category</option>
                        {EXPENSE_CATEGORIES.map((value) => (
                          <option key={value} value={value}>
                            {categoryLabels[value]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 p-4 space-y-3">
                    <label className="flex items-start justify-between gap-4 cursor-pointer">
                      <div>
                        <p className="text-sm font-semibold text-[var(--fs-text-primary)]">
                          Recurring bill
                        </p>
                        <p className="text-xs font-medium text-[var(--fs-text-muted)]">
                          Useful for rent, subscriptions, utilities, and any bill that repeats on a
                          fixed cadence.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={recurringEnabled}
                        onChange={(event) => setRecurringEnabled(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-[var(--fs-primary)]"
                      />
                    </label>
                    {recurringEnabled ? (
                      <div className="grid grid-cols-3 gap-2">
                        {RECURRING_EXPENSE_FREQUENCIES.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRecurringFrequency(value)}
                            className={[
                              'rounded-xl border px-3 py-2 text-sm font-bold transition-colors',
                              recurringFrequency === value
                                ? 'border-[var(--fs-primary)] bg-[var(--fs-primary)]/10 text-[var(--fs-primary)]'
                                : 'border-[var(--fs-border)] bg-[var(--fs-card)] text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]',
                            ].join(' ')}
                          >
                            {recurringLabels[value]}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--fs-text-primary)]">
                      Participants
                    </label>
                    <div className="grid gap-2 max-h-44 overflow-y-auto pr-1">
                      {participantOptions.map((member) => (
                        <label
                          key={member.id}
                          className="flex items-center justify-between rounded-xl border-2 border-[var(--fs-border)] bg-[var(--fs-surface)] px-3 py-2 text-sm font-semibold text-[var(--fs-text-primary)] transition-all hover:border-[var(--fs-primary)]/40"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={participants.includes(member.id)}
                              onChange={() => toggleParticipant(member.id)}
                              disabled={member.id === payerId}
                              className="h-4 w-4 accent-[var(--fs-primary)]"
                            />
                            <span>{member.name}</span>
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">
                            {member.role.toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-[var(--fs-text-primary)]">
                        Split type
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          saveDefaultSplit(buildDefaultSplitPreference(splitType, participants))
                        }
                        disabled={savingDefault || participants.length === 0}
                        className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-xs font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] disabled:opacity-60"
                      >
                        {savingDefault ? 'Saving...' : 'Save as default'}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {EXPENSE_SPLIT_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSplitType(type)}
                          className={[
                            'rounded-xl border px-3 py-2 text-sm font-bold capitalize transition-colors',
                            splitType === type
                              ? 'border-[var(--fs-primary)] bg-[var(--fs-primary)]/10 text-[var(--fs-primary)]'
                              : 'border-[var(--fs-border)] bg-[var(--fs-background)] text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]',
                          ].join(' ')}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={resetDefaultSplit}
                      disabled={savingDefault}
                      className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--fs-text-muted)] hover:text-[var(--fs-primary)] disabled:opacity-60"
                    >
                      Reset default to equal split
                    </button>
                  </div>

                  {splitType === 'exact' ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[var(--fs-text-primary)]">
                        Exact amounts (cents)
                      </p>
                      <div className="grid gap-2 max-h-40 overflow-y-auto pr-1">
                        {participants.map((id) => {
                          const member = participantOptions.find(
                            (participant) => participant.id === id,
                          );
                          return (
                            <input
                              key={id}
                              type="number"
                              min="0"
                              className="w-full rounded-xl border-2 border-[var(--fs-border)] bg-[var(--fs-surface)] p-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                              placeholder={`Amount for ${member?.name ?? id}`}
                              value={exactByUser[id] ?? ''}
                              onChange={(event) =>
                                setExactByUser({ ...exactByUser, [id]: event.target.value })
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {splitType === 'percentage' ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[var(--fs-text-primary)]">
                        Percentages
                      </p>
                      <div className="grid gap-2 max-h-40 overflow-y-auto pr-1">
                        {participants.map((id) => {
                          const member = participantOptions.find(
                            (participant) => participant.id === id,
                          );
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2"
                            >
                              <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-20 rounded-lg border border-[var(--fs-border)] bg-[var(--fs-background)] p-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                                value={percentagesByUser[id] ?? ''}
                                onChange={(event) =>
                                  setPercentagesByUser({
                                    ...percentagesByUser,
                                    [id]: event.target.value,
                                  })
                                }
                              />
                              <span className="text-sm font-semibold text-[var(--fs-text-muted)]">
                                {member?.name ?? id}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--fs-text-muted)]">
                      <Sparkles className="w-4 h-4 text-[var(--fs-primary)]" />
                      <span>
                        {recurringEnabled
                          ? `This will repeat ${recurringLabels[recurringFrequency].toLowerCase()}.`
                          : 'Totals auto-balance across participants.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-royal px-6 py-2" disabled={submitting}>
                        {submitting ? 'Saving...' : expense ? 'Update expense' : 'Save expense'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </Portal>
      )}
    </AnimatePresence>
  );
}
