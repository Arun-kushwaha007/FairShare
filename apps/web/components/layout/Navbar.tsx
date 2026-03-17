'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, ChevronRight } from 'lucide-react';

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
    <nav 
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? 'pt-4' : 'pt-8'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div 
          className={`flex h-20 items-center justify-between px-8 rounded-[2rem] transition-all duration-500 ${
            scrolled 
              ? 'bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-12px_rgba(168,85,247,0.2)]' 
              : 'bg-transparent border border-transparent'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-110">
              <Image 
                src="/logo.png" 
                alt="FairShare Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-white group-hover:text-purple-400 transition-colors">
              FAIRSHARE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-purple-400 ${
                  pathname === link.href ? 'text-purple-500' : 'text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <Link
              href="/waitlist"
              className="group relative flex items-center gap-2 px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105"
            >
              <span>LOCK IN SPOT</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl lg:hidden"
          >
            <div className="flex flex-col h-full pt-32 px-10">
              <div className="flex flex-col gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-black italic tracking-tighter text-white uppercase"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/waitlist"
                  onClick={() => setIsOpen(false)}
                  className="mt-10 flex items-center justify-center gap-3 bg-purple-600 py-6 text-2xl font-black italic tracking-tighter text-white uppercase rounded-2xl"
                >
                  GET EARLY ACCESS <Rocket size={24} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
