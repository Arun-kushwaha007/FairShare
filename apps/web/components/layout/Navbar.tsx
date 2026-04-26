'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, User } from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Waitlist', href: '/waitlist' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);

  const isDashboard = pathname?.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.removeAttribute('data-scroll-lock');
      return;
    }

    document.body.setAttribute('data-scroll-lock', 'true');
    const frame = window.requestAnimationFrame(() => {
      const firstFocusable = menuPanelRef.current?.querySelector<HTMLElement>('a, button');
      firstFocusable?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.removeAttribute('data-scroll-lock');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  if (isDashboard) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-[100]">
      <div className="mx-auto max-w-[var(--fs-content-max-width)] px-[var(--fs-section-inline)] pt-4 sm:px-6 sm:pt-5 xl:px-[var(--fs-section-inline-wide)]">
        <motion.div
          animate={{
            backgroundColor: scrolled || isOpen ? 'rgba(8, 8, 10, 0.88)' : 'rgba(8, 8, 10, 0.64)',
            backdropFilter: scrolled || isOpen ? 'blur(14px)' : 'blur(10px)',
            borderColor:
              scrolled || isOpen ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
            boxShadow:
              scrolled || isOpen
                ? '0 18px 45px rgba(0, 0, 0, 0.42)'
                : '0 12px 28px rgba(0, 0, 0, 0.22)',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[4.5rem] items-center justify-between rounded-[1.75rem] border px-4 py-3 sm:px-5 lg:px-6"
        >
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="FairShare Logo" className="h-full w-full object-cover" />
              <div className="absolute -inset-1 rounded-xl bg-purple-500/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="truncate text-lg font-black tracking-tighter text-white sm:text-xl">
              Fair<span className="text-purple-400">Share</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            <ul className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`relative rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all hover:text-white ${
                      pathname === link.href ? 'text-white' : 'text-zinc-300'
                    }`}
                  >
                    {pathname === link.href && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 z-[-1] rounded-2xl bg-white/10"
                        transition={{ duration: 0.25 }}
                      />
                    )}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="group relative flex h-11 items-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-xs font-black uppercase tracking-widest text-black shadow-xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Sign In</span>
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition-colors hover:text-white lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            key="backdrop"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-menu"
            ref={menuPanelRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[var(--fs-section-inline)] right-[var(--fs-section-inline)] top-[calc(100%+0.75rem)] z-[110] overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:left-6 sm:right-6 lg:hidden xl:left-[var(--fs-section-inline-wide)] xl:right-[var(--fs-section-inline-wide)]"
            role="dialog"
            aria-modal="true"
          >
            <ul className="mb-6 space-y-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-4 py-3 text-lg font-bold transition-all ${
                      pathname === link.href
                        ? 'bg-purple-500/14 text-purple-300'
                        : 'text-white hover:bg-white/5 hover:translate-x-1'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              <Link
                href="/login"
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-base font-bold text-white transition-colors hover:bg-white/10"
              >
                <User size={18} />
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-base font-black text-black transition-transform active:scale-95"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
