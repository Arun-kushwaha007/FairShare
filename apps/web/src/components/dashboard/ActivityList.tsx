'use client';

import Link from 'next/link';
import { ActivityDto, formatCurrencyFromCents } from '@fairshare/shared-types';
import { Clock, Receipt, Users, Plus, Trash2, UserPlus, Milestone, ArrowUpRight, BellRing, ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Selects the icon component and Tailwind color classes for a given activity type.
 *
 * @param type - Activity event type used to determine the icon and color scheme
 * @returns An object containing `Icon` (the React icon component) and `color` (a Tailwind CSS class string)
 */
function getIconForType(type: ActivityDto['type']) {
  switch (type) {
    case 'expense_created': return { Icon: Plus, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'expense_updated': return { Icon: Receipt, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    case 'expense_deleted': return { Icon: Trash2, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    case 'settlement_created': return { Icon: Milestone, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
    case 'settlement_reminder': return { Icon: BellRing, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'member_joined': return { Icon: UserPlus, color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' };
    default: return { Icon: ActivitySquare, color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };
  }
}

/**
 * Formats the monetary amount found in an activity's metadata.
 *
 * Reads `amountCents` or `totalAmountCents` from `activity.metadata` and formats it using the
 * metadata `currency` when it is `USD`, `EUR`, or `INR`; otherwise formats using `USD`.
 *
 * @param activity - The activity object whose metadata may contain the amount and currency
 * @returns The formatted currency string when a valid amount is present, or `null` when not
 */
function formatAmount(activity: ActivityDto): string | null {
  const raw = activity.metadata?.amountCents ?? activity.metadata?.totalAmountCents;
  if (typeof raw !== 'string') {
    return null;
  }
  const currency = activity.metadata?.currency;
  return currency === 'USD' || currency === 'EUR' || currency === 'INR'
    ? formatCurrencyFromCents(raw, currency)
    : formatCurrencyFromCents(raw, 'USD');
}

/**
 * Selects a concise primary label for an activity based on its type.
 *
 * @param activity - The activity object whose `type` determines the label
 * @returns A short human-readable label corresponding to `activity.type` (for example: "Expense added", "Settlement completed", "Member joined", or "Activity update" when the type is unrecognized)
 */
function labelForActivity(activity: ActivityDto): string {
  switch (activity.type) {
    case 'expense_created':
      return 'Expense added';
    case 'expense_updated':
      return 'Expense updated';
    case 'expense_deleted':
      return 'Expense removed';
    case 'settlement_created':
      return 'Settlement completed';
    case 'settlement_reminder':
      return 'Settlement reminder sent';
    case 'member_joined':
      return 'Member joined';
    case 'member_invited':
      return 'Member invited';
    default:
      return 'Activity update';
  }
}

/**
 * Produce a concise subtitle describing an activity, including a formatted amount when available.
 *
 * @param activity - The activity record to generate the subtitle for
 * @returns A short subtitle string for the given activity. If the activity contains a monetary amount, the formatted amount is included in the returned text; otherwise a fixed descriptive phrase is returned.
 */
function subtitleForActivity(activity: ActivityDto): string {
  const amount = formatAmount(activity);
  switch (activity.type) {
    case 'settlement_created':
      return amount ? `${amount} marked as settled` : 'A balance was cleared';
    case 'settlement_reminder':
      return amount ? `${amount} still pending` : 'A pending balance needs follow-up';
    case 'expense_created':
    case 'expense_updated':
      return amount ? `${amount} logged in the ledger` : 'Ledger updated';
    case 'expense_deleted':
      return 'An expense was removed from the ledger';
    case 'member_joined':
      return 'Group membership changed';
    case 'member_invited':
      return 'Invite sent to a member';
    default:
      return 'Protocol signal';
  }
}

/**
 * Render a live activity list showing recent ActivityDto events with icons, timestamps, and optional formatted amounts.
 *
 * Displays each activity with a type-specific icon and color, a primary label, a time, a contextual subtitle, and (on wider screens) a formatted amount and badge. When `items` is empty or not an array, shows a dashed empty state panel labeled `NO_SIGNAL_DETECTED`.
 *
 * @param items - Optional array of activity items to display; non-array values are treated as an empty list.
 * @param groupId - Group identifier appended to the timeline link as the `groupId` query parameter.
 * @returns The rendered activity list UI element.
 */
export function ActivityList({ items = [], groupId = '' }: { items?: ActivityDto[]; groupId?: string }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-surface)] p-4 sm:p-6 transition-all hover:shadow-lg shadow-[var(--fs-shadow-soft)]">
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
        <div>
          <h2 className="text-sm font-black italic tracking-tight text-[var(--fs-text-primary)] uppercase">Live Signals</h2>
          <p className="text-[10px] font-bold tracking-widest text-[var(--fs-text-muted)] uppercase mt-0.5">Real-time ledger audit</p>
        </div>
        <Link
          href={`/dashboard/activity?groupId=${encodeURIComponent(groupId)}`}
          className="group/link flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--fs-text-muted)] hover:text-[var(--fs-text-primary)] transition-colors"
        >
          Timeline <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {safeItems.map((item, idx) => {
          const { Icon, color } = getIconForType(item.type);
          const amount = formatAmount(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 sm:gap-4 group/item cursor-pointer"
            >
              <div className={`h-8 w-8 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl border ${color}`}>
                <Icon size={16} />
              </div>

              <div className="flex-grow min-w-0">
                <p className="text-xs font-black tracking-tight text-[var(--fs-text-primary)] group-hover:text-[var(--fs-primary)] transition-colors truncate">
                  {labelForActivity(item)}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fs-text-muted)]">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="h-0.5 w-0.5 rounded-full bg-zinc-800" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fs-text-secondary)] truncate">
                    {subtitleForActivity(item)}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2">
                {amount ? <span className="text-[11px] font-black text-[var(--fs-text-primary)]">{amount}</span> : null}
                <div className="h-8 w-8 rounded-full border border-[var(--fs-border)] flex items-center justify-center text-[8px] font-black text-[var(--fs-text-muted)] uppercase">
                  FS
                </div>
              </div>
            </motion.div>
          );
        })}

        {safeItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--fs-border)] p-10 text-center">
            <div className="mx-auto w-10 h-10 rounded-full border border-[var(--fs-border)] flex items-center justify-center text-[var(--fs-text-muted)] mb-4">
              <Milestone size={18} />
            </div>
            <p className="text-[10px] font-black tracking-widest text-[var(--fs-text-muted)] uppercase">NO_SIGNAL_DETECTED</p>
          </div>
        )}
      </div>
    </div>
  );
}
