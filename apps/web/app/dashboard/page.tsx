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
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Groups" value={groups.length} hint="Your active groups" />
        <SummaryCard
          title="You owe"
          value={formatUsd(oweCents)}
          hint={activeGroupId ? `Based on ${activeGroupId}` : 'No group selected'}
        />
        <SummaryCard
          title="You are owed"
          value={formatUsd(owedToMeCents)}
          hint={me ? `Signed in as ${me.email}` : 'Session active'}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        {activeGroupId ? (
          <ActivityList groupId={activeGroupId} items={activity} />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-text-secondary shadow-glass backdrop-blur-glass">
            Create or join a group to see activity.
          </div>
        )}
        <QuickActions groupId={activeGroupId} />
      </section>
    </DashboardLayout>
  );
}
