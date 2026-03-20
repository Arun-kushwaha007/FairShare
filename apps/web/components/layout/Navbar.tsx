'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { SectionContainer } from './SectionContainer';

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
          : 'py-5 bg-transparent'
      }`}
    >
      <SectionContainer size="spacious" className="!py-0">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105 active:scale-95">
                <Sparkles size={18} className="text-white" />
                <div className="absolute inset-0 rounded-xl border border-white/20" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Fair<span className="text-purple-400">Share</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm font-semibold transition-colors hover:text-white ${
                      pathname === link.href ? 'text-white' : 'text-zinc-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white lg:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </SectionContainer>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl"
          >
            <div className="px-6 py-8 space-y-6">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`block text-lg font-bold transition-colors ${
                        pathname === link.href ? 'text-purple-400' : 'text-white hover:text-purple-400'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3.5 text-base font-bold text-white transition-transform active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
