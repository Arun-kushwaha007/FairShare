import { GroupMemberSummaryDto } from '@fairshare/shared-types';

interface MemberListProps {
  members: GroupMemberSummaryDto[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
      <h2 className="text-base font-semibold text-text-primary">Group Members</h2>
      <div className="mt-4 space-y-4">
        {members.map((member) => (
          <div key={member.memberId} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand font-bold">
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
  );
}
