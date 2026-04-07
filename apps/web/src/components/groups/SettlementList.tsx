'use client';

import { useMemo, useState } from 'react';
import { ActivityDto, CurrencyCode, SimplifySuggestionDto, formatCurrencyFromCents } from '@fairshare/shared-types';
import { BellRing, CheckCircle2, Clock3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createSettlementAction, remindSettlementAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

type SettlementListProps = {
  groupId: string;
  currency: string;
  suggestions: SimplifySuggestionDto[];
  memberLookup: Record<string, { name: string; email: string }>;
  initialReminderActivity: ActivityDto[];
};

const suggestionKey = (fromUserId: string, toUserId: string, amountCents: string) => `${fromUserId}-${toUserId}-${amountCents}`;

function timeAgo(iso: string): string {
  const now = Date.now();
  const diff = Math.max(1, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (diff < 60) return `${diff}s ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SettlementList({ groupId, currency, suggestions, memberLookup, initialReminderActivity }: SettlementListProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [reminderId, setReminderId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [fromUserId, setFromUserId] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [reminderEvents, setReminderEvents] = useState<ActivityDto[]>(initialReminderActivity);
  const { toast } = useToast();
  const router = useRouter();

  const formatAmount = (cents: string) => formatCurrencyFromCents(cents, currency as CurrencyCode);

  const labelForUser = (userId: string) => memberLookup[userId]?.name ?? userId;

  const userOptions = useMemo(
    () =>
      Object.entries(memberLookup)
        .map(([userId, value]) => ({ userId, label: value.name || value.email || userId }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [memberLookup],
  );

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return suggestions.filter((item) => {
      if (fromUserId && item.fromUserId !== fromUserId) {
        return false;
      }
      if (toUserId && item.toUserId !== toUserId) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }

      const haystack = [labelForUser(item.fromUserId), labelForUser(item.toUserId), formatAmount(item.amountCents)]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [fromUserId, query, suggestions, toUserId, memberLookup]);

  const latestReminderBySuggestion = useMemo(() => {
    const entries = new Map<string, ActivityDto>();

    reminderEvents.forEach((event) => {
      if (event.type !== 'settlement_reminder') {
        return;
      }

      const payerId = typeof event.metadata?.payerId === 'string' ? event.metadata.payerId : null;
      const receiverId = typeof event.metadata?.receiverId === 'string' ? event.metadata.receiverId : null;
      const amountCents = typeof event.metadata?.amountCents === 'string' ? event.metadata.amountCents : null;
      if (!payerId || !receiverId || !amountCents) {
        return;
      }

      const key = suggestionKey(payerId, receiverId, amountCents);
      const existing = entries.get(key);
      if (!existing || new Date(event.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        entries.set(key, event);
      }
    });

    return entries;
  }, [reminderEvents]);

  const recentReminders = useMemo(
    () =>
      reminderEvents
        .filter((event) => event.type === 'settlement_reminder')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [reminderEvents],
  );

  const resetFilters = () => {
    setQuery('');
    setFromUserId('');
    setToUserId('');
  };

  const markSettled = async (suggestion: SimplifySuggestionDto) => {
    setPendingId(suggestionKey(suggestion.fromUserId, suggestion.toUserId, suggestion.amountCents));
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

  const sendReminder = async (suggestion: SimplifySuggestionDto) => {
    const key = suggestionKey(suggestion.fromUserId, suggestion.toUserId, suggestion.amountCents);
    setReminderId(key);
    const result = await remindSettlementAction(groupId, {
      payerId: suggestion.fromUserId,
      receiverId: suggestion.toUserId,
      amountCents: suggestion.amountCents,
    });

    if (!result.success) {
      toast(result.message ?? 'Failed to send reminder', 'error');
      setReminderId(null);
      return;
    }

    if ('activity' in result && result.activity) {
      setReminderEvents((prev) => [result.activity, ...prev.filter((event) => event.id !== result.activity.id)]);
    }
    toast(`Reminder sent to ${labelForUser(suggestion.fromUserId)}`);
    setReminderId(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 shadow-[var(--fs-shadow-soft)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Settlement suggestions</h2>
            <p className="mt-1 text-sm font-medium text-[var(--fs-text-muted)]">Filter by payer, receiver, or amount to find the right settlement quickly.</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">
            {filteredSuggestions.length}/{suggestions.length} suggestions
          </span>
        </div>

        <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))_auto]">
          <input
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
            placeholder="Search payer, receiver, amount..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
            value={fromUserId}
            onChange={(event) => setFromUserId(event.target.value)}
          >
            <option value="">All payers</option>
            {userOptions.map((user) => (
              <option key={user.userId} value={user.userId}>{user.label}</option>
            ))}
          </select>
          <select
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
            value={toUserId}
            onChange={(event) => setToUserId(event.target.value)}
          >
            <option value="">All receivers</option>
            {userOptions.map((user) => (
              <option key={user.userId} value={user.userId}>{user.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {recentReminders.length > 0 ? (
        <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 shadow-[var(--fs-shadow-soft)]">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-[var(--fs-primary)]" />
            <h3 className="text-base font-extrabold text-[var(--fs-text-primary)]">Recent reminders</h3>
          </div>
          <div className="mt-3 space-y-2">
            {recentReminders.map((event) => {
              const payerId = typeof event.metadata?.payerId === 'string' ? event.metadata.payerId : '';
              const receiverId = typeof event.metadata?.receiverId === 'string' ? event.metadata.receiverId : '';
              const amountCents = typeof event.metadata?.amountCents === 'string' ? event.metadata.amountCents : '0';
              return (
                <div key={event.id} className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--fs-text-primary)]">
                    {(event.actorName ?? labelForUser(event.actorUserId))} reminded {labelForUser(payerId)} to pay {labelForUser(receiverId)}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[var(--fs-text-muted)]">
                    <span>{formatAmount(amountCents)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {timeAgo(event.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {filteredSuggestions.length === 0 ? (
        <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-8 text-center shadow-[var(--fs-shadow-soft)]">
          <p className="text-lg font-bold text-[var(--fs-text-primary)] mb-1">
            {suggestions.length === 0 ? 'All clear' : 'No matching settlements'}
          </p>
          <p className="text-sm font-medium text-[var(--fs-text-muted)]">
            {suggestions.length === 0 ? 'No suggested settlements right now.' : 'Try a different payer, receiver, or search query.'}
          </p>
        </div>
      ) : (
        filteredSuggestions.map((item) => {
          const key = suggestionKey(item.fromUserId, item.toUserId, item.amountCents);
          const pending = pendingId === key;
          const reminding = reminderId === key;
          const latestReminder = latestReminderBySuggestion.get(key);

          return (
            <div
              key={key}
              className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--fs-text-primary)]">
                  {labelForUser(item.fromUserId)} <span className="text-[var(--fs-text-muted)]">pays</span>{' '}
                  {labelForUser(item.toUserId)}
                </p>
                <p className="text-[11px] font-medium text-[var(--fs-text-muted)]">{formatAmount(item.amountCents)}</p>
                {latestReminder ? (
                  <p className="mt-1 text-[11px] font-medium text-[var(--fs-text-muted)]">
                    Last reminded {timeAgo(latestReminder.createdAt)} by {latestReminder.actorName ?? labelForUser(latestReminder.actorUserId)}
                  </p>
                ) : null}
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2">
                <button
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
                  onClick={() => void sendReminder(item)}
                  disabled={reminding}
                >
                  {reminding ? 'Sending...' : <><BellRing className="w-4 h-4 text-[var(--fs-primary)]" />Remind</>}
                </button>
                <button
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
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
            </div>
          );
        })
      )}
    </div>
  );
}
