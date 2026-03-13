import { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh">{children}</div>;
}