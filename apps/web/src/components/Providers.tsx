'use client';

import { AuthProvider } from './auth/AuthProvider';
import { RealtimeProvider } from './realtime/RealtimeProvider';
import { ToastProvider } from './ui/Toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
