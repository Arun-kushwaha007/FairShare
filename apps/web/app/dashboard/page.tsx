import { ActivityDto } from '@fairshare/shared-types';

import { ActivityList, QuickActions, SummaryCard } from '../../src/components/dashboard';
import { DashboardLayout } from '../../src/components/layout';
import { backendFetch } from '../../src/lib/backend';

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryCard
            title="Total Balance"
            value={formatMoney(totalBalanceCents, 'USD')}
            hint={isPositive ? 'You are owed overall' : 'You owe overall'}
          />
          <SummaryCard
            title="Active Groups"
            value={groups.length.toString()}
            hint="Across all categories"
          />
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityList items={recentActivity} groupId="" />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Group Balances</h2>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              {groups.map((group) => (
                <div key={group.id} className="flex items-center justify-between border-b py-3 last:border-0">
                  <span className="font-medium">{group.name}</span>
                  <span className="text-sm text-gray-500">{group.currency}</span>
                </div>
              ))}
              {groups.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500">No active groups yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
