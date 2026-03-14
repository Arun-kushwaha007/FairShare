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
        <header className="mb-12 border-b-4 border-white pb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">{group.name}</h1>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  SYNC_STATUS // LIVE // {groupId.slice(0, 8)}
                </p>
              </div>
            </div>
            <div className="neo-border border-2 border-white bg-white px-6 py-2 text-sm font-black uppercase tracking-tighter text-black shadow-[4px_4px_0px_0px_#22d3ee]">
              VAL: {group.currency}
            </div>
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
          <div className="space-y-12">
            <ExpenseTable expenses={expenses.items} />
          </div>
          
          <aside className="space-y-12">
            <MemberList groupId={groupId} members={members} />
            
            <div className="neo-border bg-zinc-900 p-8 shadow-[6px_6px_0px_0px_#facc15]">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-8">Override Panel</h3>
              <div className="grid gap-4">
                <button className="neo-pop-hover bg-white p-4 font-black uppercase text-black shadow-[4px_4px_0px_0px_#facc15] hover:bg-zinc-100 transition-all text-sm tracking-tighter">
                  + Record Expense
                </button>
                <button className="neo-pop-hover border-2 border-white bg-black p-4 font-black uppercase text-white shadow-[4px_4px_0px_0px_#a855f7] hover:bg-zinc-900 transition-all text-sm tracking-tighter">
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
