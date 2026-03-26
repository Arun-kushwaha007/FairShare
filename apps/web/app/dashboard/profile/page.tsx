import { AuthUserDto } from '@fairshare/shared-types';
import { DashboardLayout } from '../../../src/components/layout';
import { ProfilePanel } from '../../../src/components/profile/ProfilePanel';
import { backendFetch } from '../../../src/lib/backend';

export default async function ProfilePage() {
  let user: AuthUserDto | null = null;
  try {
    user = await backendFetch<AuthUserDto>('/users/me');
  } catch {
    user = null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-4 sm:p-6 shadow-[var(--fs-shadow-soft)]">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fs-text-primary)]">Your account</h1>
          <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
            Mirror the mobile profile: review your identity, hop to settings, and sign out securely.
          </p>
        </div>

        <ProfilePanel fallbackUser={user} />
      </div>
    </DashboardLayout>
  );
}
