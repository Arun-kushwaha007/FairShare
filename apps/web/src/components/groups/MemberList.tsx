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
      <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">Group Members</h2>
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="p-2 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
            title="Invite Member"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.memberId} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand font-bold shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {member.name}
                </p>
                <p className="text-xs text-text-secondary capitalize truncate">
                  {member.role.toLowerCase()}
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
