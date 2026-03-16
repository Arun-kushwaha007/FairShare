'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ActivityDto, GroupDto } from '@fairshare/shared-types';
import { ActivitySquare, BadgeCheck, Clock3, Mail, Receipt, RefreshCw, UsersRound } from 'lucide-react';
import { useToast } from '../ui/Toaster';

type ActivityResponse = { items: ActivityDto[]; nextCursor: number | null };

const iconByType: Record<ActivityDto['type'], JSX.Element> = {
  expense_created: <Receipt className="w-4 h-4" />,
  expense_updated: <RefreshCw className="w-4 h-4" />,
  expense_deleted: <ActivitySquare className="w-4 h-4" />,
  settlement_created: <BadgeCheck className="w-4 h-4" />,
  member_joined: <UsersRound className="w-4 h-4" />,
  member_invited: <Mail className="w-4 h-4" />,
};

const accentByType: Record<ActivityDto['type'], string> = {
  expense_created: '#6366F1',
  expense_updated: '#F59E0B',
  expense_deleted: '#EF4444',
  settlement_created: '#22C55E',
  member_joined: '#14B8A6',
  member_invited: '#EC4899',
};

function labelFor(activity: ActivityDto): string {
  const actor = activity.actorUserId;
  switch (activity.type) {
    case 'expense_created':
      return `${actor} created an expense`;
    case 'expense_updated':
      return `${actor} updated an expense`;
    case 'expense_deleted':
      return `${actor} deleted an expense`;
    case 'settlement_created':
      return `${actor} recorded a settlement`;
    case 'member_joined':
      return `${actor} joined the group`;
    case 'member_invited':
      return `${actor} invited a member`;
    default:
      return `${actor} performed an action`;
  }
}

function formatAmount(activity: ActivityDto): string | null {
  const cents = activity.metadata?.amountCents ?? activity.metadata?.totalAmountCents;
  if (!cents) return null;
  const currency = typeof activity.metadata?.currency === 'string' ? activity.metadata.currency : 'USD';
  return (Number(cents) / 100).toLocaleString(undefined, { style: 'currency', currency });
}

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

export function ActivityFeed({
  groups,
  initialItems,
  initialCursor,
}: {
  groups: GroupDto[];
  initialItems: ActivityDto[];
  initialCursor: number | null;
}) {
  const { toast } = useToast();
  const [items, setItems] = useState<ActivityDto[]>(initialItems);
  const [cursor, setCursor] = useState<number | null>(initialCursor);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setItems(initialItems);
    setCursor(initialCursor);
  }, [initialItems, initialCursor]);

  const selectedGroupLabel = useMemo(() => {
    if (!selectedGroupId) return 'All activity';
    const found = groups.find((g) => g.id === selectedGroupId);
    return found ? found.name : 'Group';
  }, [groups, selectedGroupId]);

  const fetchPage = async (groupId: string | null, cursorValue: number | null) => {
    const params = new URLSearchParams({
      cursor: String(cursorValue ?? 0),
      limit: '20',
    });
    if (groupId) params.set('groupId', groupId);
    const res = await fetch(`/api/activity?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('failed');
    return (await res.json()) as ActivityResponse;
  };

  const handleChangeGroup = async (groupId: string | null) => {
    setSelectedGroupId(groupId);
    setLoading(true);
    try {
      const data = await fetchPage(groupId, 0);
      setItems(data.items);
      setCursor(data.nextCursor);
    } catch {
      toast('Failed to load activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (cursor === null) return;
    setLoadingMore(true);
    try {
      const data = await fetchPage(selectedGroupId, cursor);
      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch {
      toast('Could not load more activity', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Timeline</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">
            {selectedGroupLabel}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedGroupId ?? ''}
            onChange={(e) => void handleChangeGroup(e.target.value || null)}
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-2 text-sm font-semibold text-[var(--fs-text-primary)] focus:border-[var(--fs-primary)] outline-none"
          >
            <option value="">All groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-10 text-center shadow-[var(--fs-shadow-soft)]">
          <p className="text-lg font-bold text-[var(--fs-text-primary)] mb-1">No activity yet</p>
          <p className="text-sm font-medium text-[var(--fs-text-muted)]">Create a group or record an expense to see events.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const accent = accentByType[item.type] ?? '#6D28D9';
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 px-4 py-3 flex items-center gap-3"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                >
                  {iconByType[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--fs-text-primary)] truncate">
                    {labelFor(item)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[var(--fs-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Clock3 className="w-3 h-3" />
                      {timeAgo(item.createdAt)}
                    </span>
                    {item.groupId ? (
                      <span className="px-2 py-0.5 rounded-lg border border-[var(--fs-border)] bg-[var(--fs-card)]">
                        Group {item.groupId.slice(0, 6)}
                      </span>
                    ) : null}
                  </div>
                </div>
                {formatAmount(item) ? (
                  <span className="text-sm font-bold text-[var(--fs-text-primary)]">{formatAmount(item)}</span>
                ) : null}
              </div>
            );
          })}

          {cursor !== null ? (
            <button
              onClick={() => void handleLoadMore()}
              className="w-full rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] px-4 py-3 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)] transition-colors"
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading more…' : 'Load more'}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
