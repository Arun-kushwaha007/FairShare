'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CurrencyCode, GroupMemberSummaryDto } from '@fairshare/shared-types';
import { X, Sparkles } from 'lucide-react';
import { createExpenseAction } from '../../lib/actions';
import { SplitType, equalShares, exactShares, percentageShares, sumShares } from '../../lib/split';
import { useToast } from '../ui/Toaster';

type CreateExpenseModalProps = {
  groupId: string;
  currency: CurrencyCode;
  members: GroupMemberSummaryDto[];
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export function CreateExpenseModal({ groupId, currency, members, open, onClose, onCreated }: CreateExpenseModalProps) {
  const defaultPayer = members[0]?.userId ?? '';
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(defaultPayer);
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [participants, setParticipants] = useState<string[]>(members.map((m) => m.userId));
  const [exactByUser, setExactByUser] = useState<Record<string, string>>({});
  const [percentagesByUser, setPercentagesByUser] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (defaultPayer) {
      setPayerId(defaultPayer);
    }
  }, [defaultPayer]);

  useEffect(() => {
    // Ensure payer is always a participant.
    if (payerId && !participants.includes(payerId)) {
      setParticipants((prev) => [...prev, payerId]);
    }
  }, [payerId, participants]);

  const participantOptions = useMemo(
    () => members.map((member) => ({ id: member.userId, name: member.name, email: member.email, role: member.role })),
    [members],
  );

  const toggleParticipant = (userId: string) => {
    if (userId === payerId) return; // keep payer in the split
    if (participants.includes(userId)) {
      setParticipants(participants.filter((id) => id !== userId));
    } else {
      setParticipants([...participants, userId]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const totalCents = Math.round(Number(amount || 0) * 100);

    if (!description.trim() || totalCents <= 0 || participants.length === 0) {
      setError('Add a description, amount, and at least one participant.');
      return;
    }

    let shares: Record<string, number>;
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

    const splits = participants.map((userId) => ({
      userId,
      owedAmountCents: String(shares[userId] ?? 0),
      paidAmountCents: userId === payerId ? String(totalCents) : '0',
    }));

    try {
      setSubmitting(true);
      const result = await createExpenseAction(groupId, {
        payerId,
        description: description.trim(),
        totalAmountCents: String(totalCents),
        currency,
        splits,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      toast('Expense recorded');
      onCreated?.();
      onClose();
      setDescription('');
      setAmount('');
    } catch (err) {
      setError((err as Error).message || 'Unable to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-3xl rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] shadow-[var(--fs-shadow-elevated)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--fs-border)]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Expense</p>
                  <h3 className="text-2xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Record new expense</h3>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg bg-[var(--fs-background)] hover:bg-[var(--fs-background)]/70 transition-colors">
                  <X className="w-5 h-5 text-[var(--fs-text-muted)]" />
                </button>
              </div>

              <form className="grid gap-6 px-6 py-6 md:grid-cols-[2fr_1.2fr]" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--fs-text-primary)]">Description</label>
                    <input
                      className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] p-3 text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                      placeholder="Team dinner, rideshare..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--fs-text-primary)]">Amount ({currency})</label>
                      <input
                        className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] p-3 text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--fs-text-primary)]">Payer</label>
                      <select
                        className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] p-3 text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                        value={payerId}
                        onChange={(e) => setPayerId(e.target.value)}
                      >
                        {participantOptions.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--fs-text-primary)]">Participants</label>
                    <div className="grid gap-2 max-h-44 overflow-y-auto pr-1">
                      {participantOptions.map((member) => (
                        <label
                          key={member.id}
                          className="flex items-center justify-between rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-3 py-2 text-sm font-semibold text-[var(--fs-text-primary)]"
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
                    <label className="text-sm font-semibold text-[var(--fs-text-primary)]">Split type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['equal', 'exact', 'percentage'] as SplitType[]).map((type) => (
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
                  </div>

                  {splitType === 'exact' ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[var(--fs-text-primary)]">Exact amounts (cents)</p>
                      <div className="grid gap-2 max-h-40 overflow-y-auto pr-1">
                        {participants.map((id) => {
                          const member = participantOptions.find((m) => m.id === id);
                          return (
                            <input
                              key={id}
                              type="number"
                              min="0"
                              className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] p-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                              placeholder={`Amount for ${member?.name ?? id}`}
                              value={exactByUser[id] ?? ''}
                              onChange={(e) => setExactByUser({ ...exactByUser, [id]: e.target.value })}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {splitType === 'percentage' ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[var(--fs-text-primary)]">Percentages</p>
                      <div className="grid gap-2 max-h-40 overflow-y-auto pr-1">
                        {participants.map((id) => {
                          const member = participantOptions.find((m) => m.id === id);
                          return (
                            <div key={id} className="flex items-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-20 rounded-lg border border-[var(--fs-border)] bg-[var(--fs-background)] p-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
                                value={percentagesByUser[id] ?? ''}
                                onChange={(e) => setPercentagesByUser({ ...percentagesByUser, [id]: e.target.value })}
                              />
                              <span className="text-sm font-semibold text-[var(--fs-text-muted)]">{member?.name ?? id}</span>
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
                      <span>Totals auto-balance across participants.</span>
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
                        {submitting ? 'Saving...' : 'Save expense'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
