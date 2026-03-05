'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

type Group = { id: string; name: string; currency: string };

export default function DashboardGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    void apiFetch<Group[]>('/groups').then(setGroups).catch(() => setGroups([]));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Groups</h1>
      <div className="mt-6 space-y-3">
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/dashboard/group/${group.id}`}
            className="block rounded-lg border bg-white p-4 shadow-sm"
          >
            <p className="font-semibold">{group.name}</p>
            <p className="text-sm text-slate-600">{group.currency}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
