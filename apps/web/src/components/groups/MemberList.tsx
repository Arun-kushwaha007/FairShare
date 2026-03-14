'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { UserPlus } from 'lucide-react';
import { InviteModal } from './InviteModal';

interface MemberListProps {
  groupId: string;
  members: GroupMemberSummaryDto[];
}

export function MemberList({ groupId, members }: MemberListProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="neo-border bg-zinc-900 p-8 shadow-[6px_6px_0px_0px_#a855f7]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Squad Manifest</h2>
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="p-3 neo-border border-2 border-white bg-white text-black hover:bg-zinc-100 transition-all shadow-[2px_2px_0px_0px_#a855f7] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            title="Invite Member"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.memberId} className="flex items-center gap-4 border-2 border-zinc-800 bg-black p-4 group hover:border-white transition-colors">
              <div className="flex h-12 w-12 items-center justify-center neo-border border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 font-black text-lg shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black uppercase tracking-tighter text-white truncate">
                  {member.name}
                </p>
                <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest truncate mt-1">
                  ROLE // {member.role.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


      <InviteModal 
        groupId={groupId}
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
