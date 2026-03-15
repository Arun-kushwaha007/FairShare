import { GroupDto, GroupMemberSummaryDto, SimplifySuggestionDto } from '@fairshare/shared-types';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '../../../../../src/components/layout';
import { SettlementList } from '../../../../../src/components/groups/SettlementList';
import { backendFetch } from '../../../../../src/lib/backend';

export default async function SettleGroupPage({ params }: { params: { groupId: string } }) {
  const { groupId } = params;

  try {
    const [group, members, suggestions] = await Promise.all([
      backendFetch<GroupDto>(`/groups/${groupId}`),
      backendFetch<GroupMemberSummaryDto[]>(`/groups/${groupId}/members`),
      backendFetch<SimplifySuggestionDto[]>(`/groups/${groupId}/simplify`),
    ]);

    const memberLookup = members.reduce<Record<string, { name: string; email: string }>>((acc, member) => {
      acc[member.userId] = { name: member.name, email: member.email };
      return acc;
    }, {});

    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-8 shadow-[var(--fs-shadow-soft)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Settlement</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">{group.name}</h1>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
              Suggested transfers to clear outstanding balances.
            </p>
          </div>

          <SettlementList
            groupId={groupId}
            currency={group.currency}
            suggestions={suggestions}
            memberLookup={memberLookup}
          />
        </div>
      </DashboardLayout>
    );
  } catch {
    return notFound();
  }
}
