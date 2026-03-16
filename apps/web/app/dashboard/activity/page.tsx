import { ActivityDto, GroupDto } from '@fairshare/shared-types';
import { DashboardLayout } from '../../../src/components/layout';
import { ActivityFeed } from '../../../src/components/activity/ActivityFeed';
import { backendFetch } from '../../../src/lib/backend';

type ActivityResponse = { items: ActivityDto[]; nextCursor: number | null };

export default async function ActivityPage() {
  let groups: GroupDto[] = [];
  let activity: ActivityResponse = { items: [], nextCursor: null };

  try {
    groups = await backendFetch<GroupDto[]>('/groups');
  } catch {
    groups = [];
  }

  try {
    activity = await backendFetch<ActivityResponse>('/activity?cursor=0&limit=20');
  } catch {
    activity = { items: [], nextCursor: null };
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-8 shadow-[var(--fs-shadow-soft)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Activity</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Timeline parity</h1>
          <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
            Mirror the mobile activity feed with filtering by group, realtime-friendly ordering, and readable contrasts in both themes.
          </p>
        </div>

        <ActivityFeed groups={groups} initialItems={activity.items} initialCursor={activity.nextCursor} />
      </div>
    </DashboardLayout>
  );
}
