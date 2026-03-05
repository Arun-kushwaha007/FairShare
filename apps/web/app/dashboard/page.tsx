'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Group = { id: string; name: string; currency: string };

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    void apiFetch<Group[]>('/groups').then(setGroups).catch(() => setGroups([]));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Authenticated overview of your FairShare account.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/groups" className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Groups</h2>
          <p className="text-sm text-slate-600">{groups.length} total groups</p>
        </Link>
      </div>
    </main>
  );
}
