import Link from 'next/link';
import { ActivityDto, GroupDashboardDto, formatCurrencyFromCents } from '@fairshare/shared-types';
import {
  ArrowUpRight,
  CreditCard,
  Plus,
  TrendingUp,
  AlertTriangle,
  BellRing,
  Wallet,
} from 'lucide-react';
import { ActivityList, QuickActions, SummaryCard } from '../../src/components/dashboard';
import { SpendingChart } from '../../src/components/dashboard/SpendingChart';
import { DashboardLayout } from '../../src/components/layout';
import { backendFetch } from '../../src/lib/backend';
import { GlassCard } from '../../components/ui/GlassCard';

type Group = { id: string; name: string; currency: string };

/**
 * Format an amount in cents into a localized currency string.
 *
 * If `cents` or `currency` is missing, returns "$0.00". For currency codes "USD",
 * "EUR", and "INR" the value is formatted using that currency; for any other code
 * the value is formatted using "USD" as a fallback.
 *
 * @param cents - The amount in the smallest currency unit (e.g., cents) as a string or `null`
 * @param currency - An ISO currency code (e.g., "USD", "EUR", "INR") or `null`
 * @returns A formatted currency string (for example, "$1.23")
 */
function formatMoney(cents: string | null, currency: string | null): string {
  if (!cents || !currency) {
    return '$0.00';
  }

  if (currency === 'USD' || currency === 'EUR' || currency === 'INR') {
    return formatCurrencyFromCents(cents, currency);
  }

  return formatCurrencyFromCents(cents, 'USD');
}

/**
 * Render the dashboard page showing account summaries, attention items, activity, charts, and group listings.
 *
 * Fetches dashboard and recent-activity data, derives view state (summary cards, attention queue, recent activity, and groups), and returns the assembled UI layout.
 *
 * @returns The dashboard page JSX element that displays summaries, an attention queue (when present), spending chart, quick actions, recent activity, and a list of groups.
 */
export default async function DashboardPage() {
  const [dashboard, recentActivityData] = await Promise.all([
    backendFetch<GroupDashboardDto>('/groups/dashboard'),
    backendFetch<{ items: ActivityDto[] }>('/activity'),
  ]);

  const groups: Group[] = dashboard.groups;
  const attentionItems = dashboard.attentionItems.slice(0, 4);
  const recentActivity = recentActivityData.items || [];
  const totalBalanceCents = dashboard.totalBalanceCents;
  const isPositive = Number(totalBalanceCents) >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <SummaryCard
            title="Total Balance"
            value={formatMoney(totalBalanceCents, 'USD')}
            icon="dollar"
            change="Live"
            trend={isPositive ? 'up' : 'down'}
            hint={isPositive ? 'Surplus Protocol' : 'Deficit Detected'}
          />
          <SummaryCard
            title="Active Crews"
            value={dashboard.activeGroupCount.toString()}
            icon="users"
            change="Live"
            trend="neutral"
            hint="System Synchronized"
          />
          <SummaryCard
            title="Need Attention"
            value={attentionItems.length.toString()}
            icon="receipt"
            change="Review"
            trend={attentionItems.length > 0 ? 'down' : 'up'}
            hint={attentionItems.length > 0 ? 'Action Required' : 'All Quiet'}
          />
          <SummaryCard
            title="Total Logs"
            value={recentActivity.length.toString()}
            icon="trendingUp"
            change="Recent"
            trend="up"
            hint="Fresh Activity"
          />
        </div>

        {attentionItems.length > 0 ? (
          <GlassCard className="p-5 sm:p-6 border-white/5 bg-white/[0.01]">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  Needs Attention
                </p>
                <h2 className="mt-1 text-xl font-black italic tracking-tight text-white uppercase">
                  Resolve the next blockers
                </h2>
              </div>
              <div className="h-10 w-10 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-400">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {attentionItems.map((item) => (
                <div
                  key={item.groupId}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black tracking-tight text-white uppercase">
                        {item.groupName}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                        {item.currency} · {item.memberCount} members
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/groups/${item.groupId}`}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white hover:bg-white/10"
                    >
                      Open
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.settlementCount > 0 ? (
                      <Link
                        href={`/dashboard/groups/${item.groupId}/settle`}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400"
                      >
                        <Wallet size={12} />
                        {item.settlementCount} settlements
                      </Link>
                    ) : null}
                    {item.dueRecurringCount > 0 ? (
                      <Link
                        href={`/dashboard/groups/${item.groupId}`}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-400"
                      >
                        <BellRing size={12} />
                        {item.dueRecurringCount} due recurring
                      </Link>
                    ) : null}
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-300">
                      {formatMoney(item.netBalanceCents, item.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <div className="flex flex-col gap-6">
            <QuickActions />
            <ActivityList items={recentActivity} groupId="" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GlassCard className="p-5 sm:p-8 border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-sm font-black italic tracking-tight text-white uppercase">
                    Crews & Nodes
                  </h2>
                  <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mt-0.5">
                    Distributed spending groups
                  </p>
                </div>
                <button
                  title="Create New Crew"
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {groups.map((group) => (
                  <Link
                    href={`/dashboard/groups/${group.id}`}
                    key={group.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-purple-400 transition-colors">
                        <CreditCard size={14} />
                      </div>
                      <span className="text-xs font-black tracking-tight text-white uppercase">
                        {group.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {group.currency}
                      </span>
                      <ArrowUpRight
                        size={12}
                        className="text-zinc-800 group-hover:text-purple-500 transition-colors"
                      />
                    </div>
                  </Link>
                ))}
                {groups.length === 0 && (
                  <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                      NO_ACTIVE_GROUPS_LOCATED
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 p-5 sm:p-8 flex flex-col justify-between gap-4 sm:aspect-square">
              <div className="absolute top-0 right-0 p-8">
                <TrendingUp size={48} className="text-purple-500/20" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white leading-none">
                OPTIMIZE <br /> FLOW.
              </h3>
              <p className="text-xs font-bold text-purple-200/50 uppercase tracking-widest leading-relaxed">
                Review the groups with pending settlements and due recurring bills first.
              </p>
              <button className="w-full h-12 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-[#030303] hover:bg-purple-400 transition-all">
                Review attention queue
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
