import { ActivityDto, AuthUserDto } from '@fairshare/shared-types';

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
  const [me, groups] = await Promise.all([
    backendFetch<AuthUserDto>('/users/me'),
    backendFetch<Group[]>('/groups'),
  ]);

  const [recentActivityData, summary] = await Promise.all([
    backendFetch<{ items: ActivityDto[] }>('/activity'),
    backendFetch<{ totalBalanceCents: string }>('/groups/summary'),
  ]);

  const recentActivity = recentActivityData.items || [];
  const totalBalanceCents = summary.totalBalanceCents;

  return (
    <DashboardLayout user={me}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Balance"
            amount={formatMoney(totalBalanceCents, 'USD')}
            trend={Number(totalBalanceCents) >= 0 ? 'up' : 'down'}
            description={Number(totalBalanceCents) >= 0 ? 'You are owed' : 'You owe'}
          />
          <SummaryCard
            title="Active Groups"
            amount={groups.length.toString()}
            description="Across all categories"
          />
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityList items={recentActivity} groupId="" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Group Balances</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              {groups.map((group) => (
                <div key={group.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <span className="font-medium">{group.name}</span>
                  <span className="text-sm text-gray-500">{group.currency}</span>
                </div>
              ))}
              {groups.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No active groups yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
