import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout({ children, topbarRight }: { children: ReactNode; topbarRight?: ReactNode }) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <Sidebar />
          <main className="space-y-6">
            <Topbar rightSlot={topbarRight} />
            {children}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}