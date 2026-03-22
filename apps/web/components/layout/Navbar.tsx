'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles, User, LogIn } from 'lucide-react';
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

  const isDashboard = pathname?.startsWith('/dashboard');


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (isDashboard) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'py-4' 
          : 'py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{
            backgroundColor: scrolled ? 'rgba(3, 3, 3, 0.7)' : 'rgba(3, 3, 3, 0)',
            backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
            borderColor: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
            padding: scrolled ? '10px 24px' : '10px 0px',
            borderRadius: scrolled ? '24px' : '0px',
            boxShadow: scrolled ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between border border-transparent"
        >
          {/* Logo Section */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="FairShare Logo" 
                className="h-full w-full object-cover"
              />
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 rounded-xl bg-purple-500/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              Fair<span className="text-purple-400">Share</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <ul className="flex items-center gap-1 rounded-2xl bg-white/[0.03] p-1 border border-white/5 backdrop-blur-md">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-xl hover:text-white ${
                      pathname === link.href ? 'text-white' : 'text-zinc-500'
                    }`}
                  >
                    {pathname === link.href && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 z-[-1] rounded-2xl bg-white/[0.05]"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
              >
                <LogIn size={14} className="opacity-60 group-hover:opacity-100" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="group relative flex h-11 items-center gap-2 overflow-hidden rounded-xl bg-white px-6 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
              >
                <span>Get Started</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white lg:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[-1] bg-black/60 pointer-events-none lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-4 right-4 mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/90 p-6 backdrop-blur-2xl lg:hidden shadow-3xl shadow-black"
          >
            <ul className="space-y-2 mb-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block py-3 px-4 rounded-xl text-lg font-bold transition-all ${
                      pathname === link.href 
                        ? 'bg-purple-500/10 text-purple-400' 
                        : 'text-white hover:bg-white/5 hover:translate-x-1'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
            
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-base font-bold text-white transition-colors hover:bg-white/10"
              >
                <User size={18} />
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white text-base font-black text-black transition-transform active:scale-95"
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
