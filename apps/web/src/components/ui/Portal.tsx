'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const themeContainer = document.querySelector('[data-theme]') as HTMLElement;
    setContainer(themeContainer || document.body);
    return () => setMounted(false);
  }, []);

  if (!mounted || !container) return null;

  return createPortal(children, container);
}