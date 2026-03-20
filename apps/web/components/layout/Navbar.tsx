'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'About', href: '/about' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'pt-3' : 'pt-5'}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div
          className={`flex h-16 items-center justify-between rounded-[1.5rem] px-4 sm:px-5 transition-all duration-500 ${
            scrolled
              ? 'border border-white/10 bg-black/55 backdrop-blur-2xl shadow-[0_18px_50px_-24px_rgba(168,85,247,0.35)]'
              : 'border border-transparent bg-transparent'
          }`}
        >
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="FairShare Logo" fill className="object-contain" />
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight text-white transition-colors group-hover:text-purple-300">
                FairShare
              </span>
              <span className="hidden text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500 sm:block">
                Group expenses, without friction
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${active ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/how-it-works" className="btn-secondary px-4 py-2 text-sm">
              See How It Works
            </Link>
            <Link href="/login" className="btn-royal inline-flex items-center gap-2 px-4 py-2 text-sm">
              Start Splitting
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex rounded-xl border border-white/10 bg-white/5 p-2 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pt-28">
              <div className="marketing-card flex flex-col gap-6 p-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="border-b border-white/10 pb-4 text-2xl font-semibold tracking-tight text-white last:border-b-0 last:pb-0"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="mt-2 flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="btn-royal inline-flex items-center justify-center gap-2">
                    Start Splitting
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/how-it-works" onClick={() => setIsOpen(false)} className="btn-secondary">
                    See How It Works
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
