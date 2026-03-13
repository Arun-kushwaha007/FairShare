import { GroupDto } from '@fairshare/shared-types';
import { DashboardLayout } from '../../../src/components/layout';
import { GroupCard } from '../../../src/components/groups';
import { backendFetch } from '../../../src/lib/backend';

export default async function DashboardGroupsPage() {
  let groups: GroupDto[] = [];
  try {
    groups = await backendFetch<GroupDto[]>('/groups');
  } catch {
    groups = [];
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Your Groups</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            id={group.id}
            name={group.name}
            currency={group.currency}
            memberCount={0} // Future: API to provide member count
          />
        ))}

        {groups.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-text-secondary shadow-glass backdrop-blur-glass">
            <p className="text-lg font-medium text-text-primary">No groups yet</p>
            <p className="mt-1">Create or join a group to start sharing expenses.</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}