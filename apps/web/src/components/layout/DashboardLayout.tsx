import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout({ children, topbarRight }: { children: ReactNode; topbarRight?: ReactNode }) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-12 md:grid-cols-[300px_1fr]">
          <Sidebar />
          <main className="min-h-[80vh]">
            <Topbar rightSlot={topbarRight} />
            <div className="bg-zinc-900/50 neo-border p-8 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppLayout>

  );
}