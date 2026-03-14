import Link from 'next/link';

export function QuickActions({ groupId }: { groupId?: string }) {
  return (
    <div className="neo-border bg-zinc-900 p-8 shadow-[6px_6px_0px_0px_#facc15]">
      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-8">Override Actions</h2>
      <div className="grid gap-3">
        <Link
          href="/dashboard/groups"
          className="neo-pop-hover border-2 border-white bg-white px-4 py-3 text-sm font-black uppercase tracking-tighter text-black flex justify-between items-center group shadow-[2px_2px_0px_0px_#facc15]"
        >
          <span>Browse Groups</span>
          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">GO_TO_DIR</span>
        </Link>
        <Link
          href={groupId ? `/dashboard/groups/${encodeURIComponent(groupId)}` : '/dashboard/groups'}
          className="neo-pop-hover border-2 border-white bg-black px-4 py-3 text-sm font-black uppercase tracking-tighter text-white flex justify-between items-center group shadow-[2px_2px_0px_0px_#22d3ee]"
        >
          <span>Open Active Group</span>
          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">MOUNT_FS</span>
        </Link>
        <Link
          href="/dashboard/activity"
          className="neo-pop-hover border-2 border-zinc-800 bg-black px-4 py-3 text-sm font-black uppercase tracking-tighter text-zinc-500 flex justify-between items-center group hover:text-white hover:border-white transition-all shadow-[2px_2px_0px_0px_#ec4899]"
        >
          <span>Activity Timeline</span>
          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">READ_LOGS</span>
        </Link>
      </div>
      <p className="mt-6 text-[10px] font-mono font-bold uppercase text-zinc-600">
        INFO: EXPENSE_CREATION_LOCKED. ACCESS_GROUP_VIEW_TO_POST.
      </p>
    </div>
  );
}


