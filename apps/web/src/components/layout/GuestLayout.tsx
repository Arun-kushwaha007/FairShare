import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { shellPadding } from './layoutStyles';
import { GridBackground } from '../../../components/home';
import Link from 'next/link';

export function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-[var(--fs-background)] text-[var(--fs-text-primary)] overflow-hidden">
        {/* Cinematic Backdrop */}
        <GridBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.01] to-transparent" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] bg-purple-600/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] sm:h-[700px] sm:w-[700px] bg-indigo-600/5 blur-[180px] rounded-full" />
        </div>

        <div className={`relative z-10 mx-auto max-w-5xl ${shellPadding} py-6 sm:py-10 md:py-14`}>
          <header className="flex items-center justify-between mb-8 sm:mb-12 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative overflow-hidden rounded-xl shadow-lg border border-white/20">
                <img 
                  src="/logo.png" 
                  alt="FairShare Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-[var(--fs-text-primary)]">FairShare</h2>
                <p className="text-[9px] font-bold text-[var(--fs-text-muted)] uppercase tracking-wider">Guest View</p>
              </div>
            </div>
            <Link 
              href="/login"
              className="px-4 py-2 rounded-xl bg-[var(--fs-primary)] text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </header>

          <main className="min-h-[80vh] backdrop-blur-sm">
            {children}
          </main>

          <footer className="mt-20 py-8 border-t border-[var(--fs-border)] text-center">
            <p className="text-xs font-bold text-[var(--fs-text-muted)] uppercase tracking-widest">
              FairShare • The Premium Expense Tracker
            </p>
          </footer>
        </div>
      </div>
    </AppLayout>
  );
}
