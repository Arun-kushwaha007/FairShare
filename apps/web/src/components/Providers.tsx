'use client';

import { AuthProvider } from './auth/AuthProvider';
import { RealtimeProvider } from './realtime/RealtimeProvider';
import { ToastProvider } from './ui/Toaster';
import { ThemeProvider } from './theme/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <RealtimeProvider>
            {children}
          </RealtimeProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
