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
      <div className="mb-12 border-b-4 border-white pb-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Squad Directory</h1>
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mt-2">ACCESSING_ALL_ACTIVE_NODES</p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="col-span-full neo-border bg-zinc-900 p-20 text-center">
            <p className="text-2xl font-black uppercase tracking-tighter text-zinc-500 mb-2">NO_GROUPS_INITIALIZED</p>
            <p className="text-sm font-mono text-zinc-600">Create or join a squad to synchronize records.</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}