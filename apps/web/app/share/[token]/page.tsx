import {
  BalanceDto,
  ExpenseDto,
  GroupDto,
  GroupMemberSummaryDto,
  GroupSummaryDto,
  PaginatedExpensesResponseDto,
  ActivityDto,
  formatCurrencyFromCents,
} from '@fairshare/shared-types';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

import { GuestLayout } from '../../../src/components/layout/GuestLayout';
import { ExpenseTable, GroupSummaryPanel, MemberList } from '../../../src/components/groups';
import { backendFetch } from '../../../src/lib/backend';

interface SharedGroupPageProps {
  params: Promise<{
    token: string;
  }>;
}

/**
 * Renders the shared group page for a guest accessing via a secure share token.
 *
 * Fetches group details, member summaries, recent expenses, group summary, and activity for the given token, computes the group's total spend, and returns the server-rendered guest UI that displays group information, members, and expenses.
 *
 * @param params - A promise resolving to an object containing the share `token`.
 * @returns The server-rendered React element for the shared group view.
 *
 * @remarks
 * If fetching or processing fails, the page responds with a 404 via Next.js `notFound()`.
 */
export default async function SharedGroupPage({ params }: SharedGroupPageProps) {
  const { token } = await params;

  try {
    const group = await backendFetch<GroupDto>(`/guest/groups/${token}`);
    
    const [members, expenses, summary, activity] = await Promise.all([
      backendFetch<GroupMemberSummaryDto[]>(`/guest/groups/${token}/members`),
      backendFetch<PaginatedExpensesResponseDto>(`/guest/groups/${token}/expenses?limit=50`),
      backendFetch<GroupSummaryDto>(`/guest/groups/${token}/summary`),
      backendFetch<ActivityDto[]>(`/guest/groups/${token}/activity`),
    ]);

    // Note: If members list is protected, we might need a guest version of that too.
    // Let's assume for now we can fetch it or we'll add a guest endpoint.

    const totalExpensesCents = expenses.items.reduce((sum, expense) => sum + BigInt(expense.totalAmountCents), 0n);

    return (
      <GuestLayout>
        <div className="space-y-10">
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo-500]" />
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              You are viewing this group via a secure share link. Sign in to edit or add expenses.
            </p>
          </div>

          <header className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 sm:p-8 shadow-[var(--fs-shadow-soft)]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Shared Group</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">{group.name}</h1>
                <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 w-full sm:w-auto">
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-3 py-2 sm:px-4 sm:py-3 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Currency</p>
                  <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">{group.currency}</p>
                </div>
                <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-3 py-2 sm:px-4 sm:py-3 text-right">
                   <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Total spend</p>
                   <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">
                     {formatCurrencyFromCents(totalExpensesCents, group.currency)}
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
                balances={[]} // We don't show user-specific balances to guests
                members={members}
                isGuest={true}
              />
              <ExpenseTable 
                expenses={expenses.items as ExpenseDto[]} 
                members={members} 
                isGuest={true}
                totalRecordsLabel={expenses.nextCursor !== null ? `${expenses.items.length}+` : String(expenses.items.length)}
              />
            </div>

            <aside className="space-y-10">
              <Suspense fallback={<div className="h-52 rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] animate-pulse" />}>
                <MemberList groupId={group.id} members={members} isGuest={true} />
              </Suspense>
              
              <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-6 shadow-[var(--fs-shadow-soft)] space-y-4">
                <h3 className="text-lg font-bold text-[var(--fs-text-primary)]">Join the conversation</h3>
                <p className="text-sm text-[var(--fs-text-muted)] leading-relaxed">
                  Want to record an expense or settle up? Creating an account is fast and free.
                </p>
                <Link 
                  href="/register"
                  className="block w-full text-center py-3 rounded-xl bg-[var(--fs-primary)] text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity"
                >
                  Create Account
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </GuestLayout>
    );
  } catch (error) {
    console.error('Failed to fetch shared group details:', error);
    return notFound();
  }
}
