import Link from 'next/link';
import { DashboardLayout } from '../../../src/components/layout';
import { backendFetch } from '../../../src/lib/backend';

type Group = { id: string; name: string; currency: string };

export default async function DashboardGroupsPage() {
  let groups: Group[] = [];
  try {
    groups = await backendFetch<Group[]>('/groups');
  } catch {
    groups = [];
  }

  return (
    <DashboardLayout>
      <section className="space-y-3">
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/dashboard/group/${group.id}`}
            className="block rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass"
          >
            <p className="font-semibold text-text-primary">{group.name}</p>
            <p className="mt-1 text-sm text-text-secondary">{group.currency}</p>
          </Link>
        ))}
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-text-secondary shadow-glass backdrop-blur-glass">
            No groups yet.
          </div>
        ) : null}
      </section>
    </DashboardLayout>
  );
}