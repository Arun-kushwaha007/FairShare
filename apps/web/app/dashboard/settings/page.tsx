import { DashboardLayout } from '../../../src/components/layout';
import { AppearanceSettings } from '../../../src/components/settings/AppearanceSettings';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-5 sm:p-8 shadow-[var(--fs-shadow-soft)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Appearance</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Display & theme</h1>
          <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
            Match the mobile experience with instant light, dark, or system-aware themes. All text automatically keeps contrast for readability.
          </p>
        </div>

        <AppearanceSettings />
      </div>
    </DashboardLayout>
  );
}
