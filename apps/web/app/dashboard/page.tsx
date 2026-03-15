import { ActivityDto, AuthUserDto } from '@fairshare/shared-types';

import { ActivityList, QuickActions, SummaryCard } from '../../src/components/dashboard';
import { DashboardLayout } from '../../src/components/layout';
import { backendFetch } from '../../src/lib/backend';

type Group = { id: string; name: string; currency: string };
type Balance = { id: string; userId: string; counterpartyUserId: string; amountCents: string };

function formatUsd(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return dollars.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default async function DashboardPage() {
  const [me, groups] = await Promise.all([
    backendFetch<AuthUserDto>('/users/me').catch(() => null),
    backendFetch<Group[]>('/groups').catch(() => [] as Group[]),
  ]);

  const activeGroupId = groups[0]?.id;

  const [balances, activity] = await Promise.all([
    activeGroupId
      ? backendFetch<Balance[]>(`/groups/${activeGroupId}/balances`).catch(() => [] as Balance[])
      : Promise.resolve([] as Balance[]),
    activeGroupId
      ? backendFetch<ActivityDto[]>(`/groups/${activeGroupId}/activity?cursor=0&limit=5`).catch(() => [] as ActivityDto[])
      : Promise.resolve([] as ActivityDto[]),
  ]);

  let oweCents = 0n;
  let owedToMeCents = 0n;
  if (me) {
    for (const bal of balances) {
      if (bal.userId !== me.id) continue;
      const amt = BigInt(bal.amountCents);
      if (amt < 0n) oweCents += -amt;
      else owedToMeCents += amt;
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--fs-text-primary)]">Balance summary</h2>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fs-text-muted)]">
              Updated realtime
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
          <SummaryCard title="Active groups" value={groups.length} hint="Registered ensembles" />
          <SummaryCard
            title="Liabilities"
            value={formatUsd(oweCents)}
            hint={activeGroupId ? `Group ref: ${activeGroupId.slice(0, 8)}...` : 'No active group'}
          />
          <SummaryCard
            title="Assets"
            value={formatUsd(owedToMeCents)}
            hint={me ? `Linked to: ${me.email}` : 'Sign in to track personal totals'}
          />
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-[1fr_350px]">
          {activeGroupId ? (
            <ActivityList groupId={activeGroupId} items={activity} />
          ) : (
            <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-10 text-center shadow-[var(--fs-shadow-soft)]">
              <p className="text-xl font-bold text-[var(--fs-text-primary)] mb-2">No active group detected</p>
              <p className="text-sm font-medium text-[var(--fs-text-muted)]">
                Create or select a group to start tracking balances and activity.
              </p>
            </div>
          )}
          <QuickActions groupId={activeGroupId} />
        </section>
      </div>
    </DashboardLayout>
  );
}
