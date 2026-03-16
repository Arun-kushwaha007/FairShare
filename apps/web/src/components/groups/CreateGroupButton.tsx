'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Plus } from 'lucide-react';

const CreateGroupModal = dynamic(
  () => import('./CreateGroupModal').then((mod) => mod.CreateGroupModal),
  { ssr: false },
);

export function CreateGroupButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-royal inline-flex items-center gap-2 px-4 py-2 text-sm"
      >
        <Plus className="w-4 h-4" />
        New group
      </button>

      <CreateGroupModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => router.refresh()}
      />
    </>
  );
}
