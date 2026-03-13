import Link from 'next/link';
import { DashboardLayout } from '../../src/components/layout';
import { backendFetch } from '../../src/lib/backend';

type Group = { id: string; name: string; currency: string };

export default async function DashboardPage() {
  let groups: Group[] = [];
  try {
    groups = await backendFetch<Group[]>('/groups');
  } catch {
    groups = [];
  }

  return (
    <DashboardLayout>
      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/groups" className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
          <h2 className="font-semibold text-text-primary">Groups</h2>
          <p className="mt-1 text-sm text-text-secondary">{groups.length} total groups</p>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
          <h2 className="font-semibold text-text-primary">Quick actions</h2>
          <p className="mt-1 text-sm text-text-secondary">Create expenses and settle balances.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
          <h2 className="font-semibold text-text-primary">Recent activity</h2>
          <p className="mt-1 text-sm text-text-secondary">Coming next.</p>
        </div>
      </section>
    </DashboardLayout>
  );
}