import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { shellPadding } from './layoutStyles';

export function DashboardLayout({ children, topbarRight }: { children: ReactNode; topbarRight?: ReactNode }) {
  return (
    <AppLayout>
      <div className={`mx-auto max-w-6xl ${shellPadding} py-10 md:py-14`}>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <main className="min-h-[80vh] flex flex-col gap-6">
            <Topbar rightSlot={topbarRight} />
            <div className="flex-grow">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
