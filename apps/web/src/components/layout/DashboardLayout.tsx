import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { shellPadding } from './layoutStyles';
import { GridBackground } from '../../../components/home';

export function DashboardLayout({ children, topbarRight }: { children: ReactNode; topbarRight?: ReactNode }) {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-[#030303] overflow-hidden">
        {/* Cinematic Backdrop */}
        <GridBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.01] to-transparent" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] bg-purple-600/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] bg-indigo-600/5 blur-[180px] rounded-full" />
        </div>

        <div className={`relative z-10 mx-auto max-w-7xl ${shellPadding} py-10 md:py-14`}>
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <main className="min-h-[80vh] flex flex-col gap-8">
              <Topbar rightSlot={topbarRight} />
              <div className="flex-grow backdrop-blur-sm">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
