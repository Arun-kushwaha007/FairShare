import { GroupDto, RecurringExpenseDto } from '@fairshare/shared-types';
import { DashboardLayout } from '../../../src/components/layout';
import { GroupCard, CreateGroupButton } from '../../../src/components/groups';
import { backendFetch } from '../../../src/lib/backend';

function isRecurringDue(item: RecurringExpenseDto): boolean {
  return new Date(item.nextOccurrenceAt).getTime() <= Date.now();
}

export default async function DashboardGroupsPage() {
  let groups: GroupDto[] = [];
  try {
    groups = await backendFetch<GroupDto[]>('/groups');
  } catch {
    groups = [];
  }

  const overdueRecurringByGroup = Object.fromEntries(
    await Promise.all(
      groups.map(async (group) => {
        try {
          const recurring = await backendFetch<RecurringExpenseDto[]>(`/groups/${group.id}/recurring-expenses`);
          return [group.id, recurring.filter(isRecurringDue).length] as const;
        } catch {
          return [group.id, 0] as const;
        }
      }),
    ),
  );

  return (
    <DashboardLayout topbarRight={<CreateGroupButton />}>
      <div className="space-y-10">
        <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 sm:p-8 shadow-[var(--fs-shadow-soft)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--fs-text-muted)] uppercase tracking-[0.14em]">Directory</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Your Groups</h1>
              <p className="text-[12px] font-medium text-[var(--fs-text-muted)] mt-1">Manage crews and dive into detailed ledgers.</p>
            </div>
            <div className="hidden sm:block rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 px-4 py-2 text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Total</p>
              <p className="text-lg font-extrabold text-[var(--fs-text-primary)]">{groups.length}</p>
            </div>
          </div>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              currency={group.currency}
              memberCount={group.members?.length ?? 0}
              overdueRecurringCount={overdueRecurringByGroup[group.id] ?? 0}
            />
          ))}

          {groups.length === 0 && (
            <div className="col-span-full rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-12 text-center shadow-[var(--fs-shadow-soft)]">
              <p className="text-xl font-bold text-[var(--fs-text-primary)] mb-2">No groups yet</p>
              <p className="text-sm font-medium text-[var(--fs-text-muted)]">Create or join a group to start sharing expenses.</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
