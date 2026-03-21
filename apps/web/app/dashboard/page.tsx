import { ActivityDto } from '@fairshare/shared-types';
import { 
  DollarSign, 
  Users, 
  TrendingDown, 
  Receipt, 
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Plus
} from 'lucide-react';
import { ActivityList, QuickActions, SummaryCard } from '../../src/components/dashboard';
import { SpendingChart } from '../../src/components/dashboard/SpendingChart';
import { DashboardLayout } from '../../src/components/layout';
import { backendFetch } from '../../src/lib/backend';
import { GlassCard } from '../../components/ui/GlassCard';

type Group = { id: string; name: string; currency: string };

function formatMoney(cents: string | null, currency: string | null): string {
  if (!cents || !currency) {
    return '$0.00';
  }

  const amount = Number(cents) / 100;
  return amount.toLocaleString(undefined, { style: 'currency', currency });
}

export default async function DashboardPage() {
  const [groups, recentActivityData, summary] = await Promise.all([
    backendFetch<Group[]>('/groups'),
    backendFetch<{ items: ActivityDto[] }>('/activity'),
    backendFetch<{ totalBalanceCents: string }>('/groups/summary'),
  ]);

  const recentActivity = recentActivityData.items || [];
  const totalBalanceCents = summary.totalBalanceCents;
  const isPositive = Number(totalBalanceCents) >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ── 4-Stat Hero Grid ── */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryCard
            title="Total Balance"
            value={formatMoney(totalBalanceCents, 'USD')}
            icon="dollar"
            change="+12.5%"
            trend={isPositive ? 'up' : 'down'}
            hint={isPositive ? 'Surplus Protocol' : 'Deficit Detected'}
          />
          <SummaryCard
            title="Active Crews"
            value={groups.length.toString()}
            icon="users"
            change="Live"
            trend="neutral"
            hint="System Synchronized"
          />
          <SummaryCard
            title="Incoming"
            value="$1,248.00"
            icon="trendingUp"
            change="+4.2%"
            trend="up"
            hint="Verified Receivables"
          />
          <SummaryCard
            title="Total Logs"
            value="142"
            icon="receipt"
            change="+12"
            trend="up"
            hint="Immutable Entries"
          />
        </div>

        {/* ── Main Visualization Row ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <div className="flex flex-col gap-6">
            <QuickActions />
            <ActivityList items={recentActivity} groupId="" />
          </div>
        </div>

        {/* ── Secondary Data Row ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-sm font-black italic tracking-tight text-white uppercase">Crews & Nodes</h2>
                  <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mt-0.5">Distributed spending groups</p>
                </div>
                <button 
                  title="Create New Crew"
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-purple-400 transition-colors">
                        <CreditCard size={14} />
                      </div>
                      <span className="text-xs font-black tracking-tight text-white uppercase">{group.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{group.currency}</span>
                      <ArrowUpRight size={12} className="text-zinc-800 group-hover:text-purple-500 transition-colors" />
                    </div>
                  </div>
                ))}
                {groups.length === 0 && (
                  <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">NO_ACTIVE_GROUPS_LOCATED</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
          
          {/* Action Trigger / Extra Slot */}
          <div className="flex flex-col gap-6">
             <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 p-8 flex flex-col justify-between aspect-square">
                <div className="absolute top-0 right-0 p-8">
                  <TrendingUp size={48} className="text-purple-500/20" />
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter text-white leading-none">
                  OPTIMIZE <br /> FLOW.
                </h3>
                <p className="text-xs font-bold text-purple-200/50 uppercase tracking-widest leading-relaxed">
                  Our algorithm has detected 3 ways to optimize your settlements.
                </p>
                <button className="w-full h-12 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-[#030303] hover:bg-purple-400 transition-all">
                  Recalculate Nodes
                </button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

