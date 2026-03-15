'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { UserPlus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { glassPanel } from '../layout/layoutStyles';

const InviteModal = dynamic(() => import('./InviteModal').then((mod) => mod.InviteModal), { ssr: false });

interface MemberListProps {
  groupId: string;
  members: GroupMemberSummaryDto[];
}

export function MemberList({ groupId, members }: MemberListProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className={`${glassPanel} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Members</h2>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
              {members.length} people collaborating in this group.
            </p>
          </div>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--fs-primary)] px-4 py-2 text-sm font-bold text-white shadow-[var(--fs-shadow-soft)] transition-all hover:-translate-y-[1px] active:translate-y-0"
            title="Invite Member"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </button>
        </div>
        
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.memberId}
              className="flex items-center gap-4 rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/70 p-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] font-bold text-lg shrink-0 border border-[var(--fs-border)]">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-[var(--fs-text-primary)] truncate">
                  {member.name}
                </p>
                <p className="text-[12px] font-medium text-[var(--fs-text-muted)] truncate">
                  {member.email}
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-lg bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] border border-[var(--fs-border)]">
                {member.role.toLowerCase()}
              </span>
            </div>
          ))}
          {members.length === 0 ? (
            <div className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-[var(--fs-text-primary)]">No members yet</p>
              <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">Invite teammates to start splitting bills.</p>
            </div>
          ) : null}
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
