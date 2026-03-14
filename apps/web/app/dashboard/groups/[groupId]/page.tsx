import { 
  ExpenseDto, 
  GroupDto, 
  GroupMemberSummaryDto,
  PaginatedExpensesResponseDto
} from '@fairshare/shared-types';
import { notFound } from 'next/navigation';

import { DashboardLayout } from '../../../../src/components/layout';
import { MemberList, ExpenseTable } from '../../../../src/components/groups';
import { backendFetch } from '../../../../src/lib/backend';

interface GroupDetailPageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { groupId } = await params;

  try {
    const [group, members, expenses] = await Promise.all([
      backendFetch<GroupDto>(`/groups/${groupId}`),
      backendFetch<GroupMemberSummaryDto[]>(`/groups/${groupId}/members`),
      backendFetch<PaginatedExpensesResponseDto>(`/groups/${groupId}/expenses?limit=50`),
    ]);

    return (
      <DashboardLayout>
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">{group.name}</h1>
            <div className="rounded-full bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              {group.currency}
            </div>
          </div>
          <p className="mt-2 text-text-secondary">
            Manage members and track shared expenses.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <ExpenseTable expenses={expenses.items} />
          </div>
          
          <aside className="space-y-6">
            <MemberList groupId={groupId} members={members} />
            
            <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
              <h3 className="text-sm font-semibold text-text-primary">Quick Actions</h3>
              <div className="mt-4 grid gap-2">
                <button className="w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  Add Expense
                </button>
                <button className="w-full rounded-xl border border-border bg-surface/10 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface/20">
                  Invite Member
                </button>
              </div>
            </div>
          </aside>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Failed to fetch group details:', error);
    return notFound();
  }
}
