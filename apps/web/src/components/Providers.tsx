'use client';

import { AuthProvider } from './auth/AuthProvider';
import { ToastProvider } from './ui/Toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}
