'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fs-cookie-consent');
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('fs-cookie-consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('fs-cookie-consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl sm:bottom-8"
        >
          <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-surface)] p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setShow(false)}
              className="absolute right-4 top-4 text-[var(--fs-text-muted)] hover:text-[var(--fs-text-primary)] sm:hidden"
            >
              <X size={18} />
            </button>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--fs-primary)]/10 text-[var(--fs-primary)] hidden sm:flex">
                <Cookie size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--fs-text-primary)] flex items-center gap-2">
                  <span className="sm:hidden text-[var(--fs-primary)]"><Cookie size={16} /></span>
                  We use cookies
                </h3>
                <p className="mt-1 text-xs text-[var(--fs-text-muted)] max-w-xl">
                  We use cookies to enhance your experience, analyze site traffic, and support our marketing efforts. By clicking &quot;Accept&quot;, you agree to our use of cookies. Read our <Link href="/privacy" className="underline hover:text-[var(--fs-primary)]">Privacy Policy</Link> for more details.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                onClick={decline}
                className="rounded-xl border border-[var(--fs-border)] px-4 py-2 text-xs font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-text-muted)] transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="rounded-xl bg-[var(--fs-primary)] px-4 py-2 text-xs font-bold text-white hover:bg-purple-600 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
