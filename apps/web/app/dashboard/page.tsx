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
        <section className="grid gap-6 md:grid-cols-3">
          <SummaryCard title="ACTIVE_GROUPS" value={groups.length} hint="Directory count" />
          <SummaryCard
            title="LIABILITIES"
            value={formatUsd(oweCents)}
            hint={activeGroupId ? `REF: ${activeGroupId.slice(0, 8)}...` : 'NULL_PTR'}
          />
          <SummaryCard
            title="ASSETS"
            value={formatUsd(owedToMeCents)}
            hint={me ? `USER: ${me.email}` : 'AUTH_OK'}
          />
        </section>

        <section className="grid gap-12 lg:grid-cols-[1fr_350px]">
          {activeGroupId ? (
            <ActivityList groupId={activeGroupId} items={activity} />
          ) : (
            <div className="neo-border bg-zinc-900 p-12 text-center">
              <p className="text-xl font-black uppercase tracking-tighter text-zinc-500 mb-2">NO_ACTIVE_GROUP_DETECTED</p>
              <p className="text-sm font-mono text-zinc-600">Initialize a group to begin expense monitoring.</p>
            </div>
          )}
          <QuickActions groupId={activeGroupId} />
        </section>
      </div>
    </DashboardLayout>
  );
}

