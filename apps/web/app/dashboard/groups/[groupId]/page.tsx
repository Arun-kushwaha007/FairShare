import { ExpenseDto, GroupDto, GroupMemberSummaryDto, PaginatedExpensesResponseDto } from '@fairshare/shared-types';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { DashboardLayout } from '../../../../src/components/layout';
import { ExpenseTable, GroupActions, MemberList } from '../../../../src/components/groups';
import { backendFetch } from '../../../../src/lib/backend';

interface GroupDetailPageProps {
  params: {
    groupId: string;
  };
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { groupId } = params;

  try {
    const [group, members, expenses] = await Promise.all([
      backendFetch<GroupDto>(`/groups/${groupId}`),
      backendFetch<GroupMemberSummaryDto[]>(`/groups/${groupId}/members`),
      backendFetch<PaginatedExpensesResponseDto>(`/groups/${groupId}/expenses?limit=50`),
    ]);

    const totalExpenses = expenses.items.reduce((sum, expense) => sum + Number(expense.totalAmountCents), 0) / 100;

    return (
      <DashboardLayout>
        <div className="space-y-10">
          <header className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-8 shadow-[var(--fs-shadow-soft)]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Group</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">{group.name}</h1>
                <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
                  Created {new Date(group.createdAt).toLocaleDateString()} • ID {groupId.slice(0, 8)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-4 py-3 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Currency</p>
                  <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">{group.currency}</p>
                </div>
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-4 py-3 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Members</p>
                  <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">{members.length}</p>
                </div>
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-4 py-3 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Total spend</p>
                  <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">
                    {totalExpenses.toLocaleString(undefined, { style: 'currency', currency: group.currency })}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <ExpenseTable expenses={expenses.items as ExpenseDto[]} members={members} />
            </div>

            <aside className="space-y-10">
              <Suspense fallback={<div className="h-52 rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] animate-pulse" />}>
                <MemberList groupId={groupId} members={members} />
              </Suspense>
              <Suspense fallback={<div className="h-40 rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] animate-pulse" />}>
                <GroupActions
                  groupId={groupId}
                  currency={group.currency}
                  members={members}
                  defaultSplitPreference={group.defaultSplitPreference}
                />
              </Suspense>
            </aside>
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Failed to fetch group details:', error);
    return notFound();
  }
}
