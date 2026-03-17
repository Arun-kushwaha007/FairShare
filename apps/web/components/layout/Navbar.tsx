'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, MoveRight } from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 z-50 w-full border-b-4 border-white transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md py-3' : 'bg-black py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-black italic tracking-tighter text-white md:text-3xl">
            FAIRSHARE
          </span>
          <div className="h-2 w-2 rounded-full bg-yellow-400 group-hover:animate-ping" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="text-sm font-black uppercase tracking-widest text-white hover:text-yellow-400 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/waitlist"
            className="neo-pop-hover neo-pop-hover-purple flex items-center gap-2 border-2 border-white bg-white px-6 py-2 text-sm font-black uppercase text-black hover:bg-transparent hover:text-white transition-all"
          >
            Join Waitlist <MoveRight size={16} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full border-b-4 border-white bg-black px-6 py-10 lg:hidden"
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-black uppercase tracking-tighter text-white"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-t-2 border-zinc-800" />
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-xl font-black uppercase tracking-tighter text-white"
              >
                Login
              </Link>
              <Link
                href="/waitlist"
                onClick={() => setIsOpen(false)}
                className="neo-pop-hover neo-pop-hover-purple flex items-center justify-center gap-2 border-2 border-white bg-white px-6 py-4 text-xl font-black uppercase text-black"
              >
                Join Waitlist <MoveRight size={24} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
