'use client';
import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { Topbar } from './Topbar';
import { shellPadding } from './layoutStyles';
import { useThemeMode } from '../theme/ThemeProvider';
import { GridBackground } from '../../../components/home';

export function DashboardLayout({ children, topbarRight }: { children: ReactNode; topbarRight?: ReactNode }) {
  const { resolved } = useThemeMode();

  return (
    <AppLayout>
      <div 
        className="relative min-h-screen bg-[var(--fs-background)] transition-colors duration-500 overflow-hidden"
        data-theme={resolved}
      >

        {/* Cinematic Backdrop */}
        <GridBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.01] to-transparent" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] bg-purple-600/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] sm:h-[700px] sm:w-[700px] bg-indigo-600/5 blur-[180px] rounded-full" />
        </div>

        <div className={`relative z-10 mx-auto max-w-7xl ${shellPadding} py-6 sm:py-10 md:py-14`}>
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <main className="min-h-[80vh] flex flex-col gap-6 sm:gap-8">
              <Topbar rightSlot={topbarRight} />
              <div className="flex-grow backdrop-blur-sm">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </AppLayout>
  );
}
