'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Twitter, Github, Linkedin, Mail, ArrowRight, Heart, ExternalLink } from 'lucide-react';
import { SectionContainer } from './SectionContainer';
import { fadeUp, staggerContainer } from '../home/motion-variants';

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Waitlist', href: '/waitlist' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    // { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    // { name: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    // { name: 'Twitter', href: 'https://twitter.com/fairshare', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/Arun-kushwaha007/FairShare', icon: Github },
    // { name: 'LinkedIn', href: 'https://linkedin.com/company/fairshare', icon: Linkedin },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-10 w-full overflow-hidden bg-[#030303] pt-24">
      {/* ── Newsletter / Engagement Section ── */}
      {/* <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05),transparent_70%)]" />
        
        <SectionContainer size="compact" className="relative pb-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-10 text-center"
          >
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Stay updated on <span className="text-purple-400">FairShare.</span>
              </h2>
              <p className="max-w-xl text-zinc-400">
                Join our newsletter for early access, product tips, and news on how to manage group finances better.
              </p>
            </motion.div>

            <motion.form
              variants={fadeUp}
              onSubmit={(e) => e.preventDefault()}
              className="group relative flex w-full max-w-lg items-center rounded-2xl border border-white/5 bg-white/[0.02] p-1.5 transition-all focus-within:border-purple-500/30 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-5 text-sm text-white placeholder:text-zinc-600 outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-purple-600 px-6 text-sm font-bold text-white transition-all hover:bg-purple-500 active:scale-95"
              >
                Subscribe
              </button>
            </motion.form>
          </motion.div>
        </SectionContainer>
      </div> */}

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* ── Main Footer Grid ── */}
      <SectionContainer size="compact" className="py-24">
        <div className="grid gap-16 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand Info */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                Fair<span className="text-purple-400">Share</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500 font-medium">
              Revolutionizing how friends, families, and organizations manage shared expenses through a premium, frictionless experience.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-zinc-500 transition-all hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { label: 'Product', links: footerLinks.product },
              { label: 'Company', links: footerLinks.company },
              { label: 'Legal', links: footerLinks.legal },
            ].map((col) => (
              <div key={col.label} className="flex flex-col gap-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  {col.label}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
                      >
                        <span className="h-0.5 w-0 rounded-full bg-purple-500 transition-all group-hover:w-3" />
                        {link.name}
                        {link.href.startsWith('http') && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* ── Bottom Section ── */}
      <div className="border-t border-white/5 py-8">
        <SectionContainer size="compact">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                © {new Date().getFullYear()} FairShare Technologies Inc.
              </p>
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-800">
                Made with <Heart size={10} className="fill-purple-500/20 text-purple-500/40" /> for global harmony
              </p>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="mailto:fairshare4u@gmail.com" className="group flex items-center gap-2 text-xs font-bold text-zinc-500 transition-colors hover:text-white">
                <Mail size={14} className="text-zinc-600 group-hover:text-purple-400" />
                fairshare4u@gmail.com
              </a>
              <div className="hidden h-4 w-px bg-white/5 md:block" />
              <p className="hidden text-xs font-bold text-zinc-800 md:block">
                All Rights Reserved.
              </p>
            </div>
          </div>
        </SectionContainer>
      </div>
    </footer>
  );
}
