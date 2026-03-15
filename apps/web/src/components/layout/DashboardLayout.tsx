import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout({ children, topbarRight }: { children: ReactNode; topbarRight?: ReactNode }) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <Sidebar />
          <main className="min-h-[80vh] flex flex-col">
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