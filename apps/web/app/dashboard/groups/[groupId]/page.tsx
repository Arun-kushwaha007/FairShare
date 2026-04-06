import {
  AuthUserDto,
  BalanceDto,
  ExpenseDto,
  GroupDto,
  GroupMemberSummaryDto,
  GroupSummaryDto,
  PaginatedExpensesResponseDto,
  RecurringExpenseDto,
} from '@fairshare/shared-types';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { DashboardLayout } from '../../../../src/components/layout';
import { ExpenseTable, GroupActions, GroupSummaryPanel, MemberList, RecurringExpenseList } from '../../../../src/components/groups';
import { backendFetch } from '../../../../src/lib/backend';

interface GroupDetailPageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { groupId } = await params;

  try {
    const [group, members, expenses, summary, balances, currentUser, recurringExpenses] = await Promise.all([
      backendFetch<GroupDto>(`/groups/${groupId}`),
      backendFetch<GroupMemberSummaryDto[]>(`/groups/${groupId}/members`),
      backendFetch<PaginatedExpensesResponseDto>(`/groups/${groupId}/expenses?limit=50`),
      backendFetch<GroupSummaryDto>(`/groups/${groupId}/summary`),
      backendFetch<BalanceDto[]>(`/groups/${groupId}/balances`),
      backendFetch<AuthUserDto>('/users/me'),
      backendFetch<RecurringExpenseDto[]>(`/groups/${groupId}/recurring-expenses`),
    ]);

    const totalExpenses = expenses.items.reduce((sum, expense) => sum + Number(expense.totalAmountCents), 0) / 100;
    const netBalance = Number(summary.perUserOwedCents[currentUser.id] ?? '0') / 100;
    const balanceLabel = netBalance > 0 ? 'You are owed' : netBalance < 0 ? 'You owe' : 'All settled';
    const balanceTone =
      netBalance > 0
        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
        : netBalance < 0
          ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
          : 'text-[var(--fs-text-muted)] bg-[var(--fs-background)] border-[var(--fs-border)]';

    return (
      <DashboardLayout>
        <div className="space-y-10">
          <header className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 sm:p-8 shadow-[var(--fs-shadow-soft)]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Group</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">{group.name}</h1>
                <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
                  Created {new Date(group.createdAt).toLocaleDateString()} - ID {groupId.slice(0, 8)}
                </p>
                <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ${balanceTone}`}>
                  <span>{balanceLabel}</span>
                  <span>{Math.abs(netBalance).toLocaleString(undefined, { style: 'currency', currency: group.currency })}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3 w-full sm:w-auto">
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-3 py-2 sm:px-4 sm:py-3 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Currency</p>
                  <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">{group.currency}</p>
                </div>
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-3 py-2 sm:px-4 sm:py-3 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Members</p>
                  <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">{members.length}</p>
                </div>
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-3 py-2 sm:px-4 sm:py-3 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Total spend</p>
                  <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">
                    {totalExpenses.toLocaleString(undefined, { style: 'currency', currency: group.currency })}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <GroupSummaryPanel
                currency={group.currency}
                summary={summary}
                balances={balances}
                currentUserId={currentUser.id}
                members={members}
              />
              <RecurringExpenseList recurringExpenses={recurringExpenses} members={members} currency={group.currency} />
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
                  shareEnabled={group.shareEnabled}
                  shareToken={group.shareToken}
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
