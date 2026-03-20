import Link from 'next/link';
import Image from 'next/image';
import { Github, Instagram, Send, Twitter } from 'lucide-react';

const footerLinks = {
  Product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'How It Works', href: '/how-it-works' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  Support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#030303] pt-20 pb-10">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-5" />
      <div className="absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] lg:gap-8">
          <div>
            <Link href="/" className="group mb-6 flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-105">
                <Image src="/logo.png" alt="FairShare Logo" fill className="object-contain p-2" />
              </div>
              <div>
                <span className="block text-xl font-extrabold tracking-tight text-white">FairShare</span>
                <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">Shared expenses made clear</span>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-zinc-400">
              FairShare helps groups track shared spending, keep balances current, and settle up without spreadsheet cleanup or message-thread confusion.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs font-medium text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Coming soon on Android and iOS
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-zinc-300 transition-colors hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/5 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span>� 2026 FairShare</span>
            <a href="mailto:support@fairsharee.com" className="inline-flex items-center gap-2 transition-colors hover:text-white">
              support@fairsharee.com
              <Send size={14} />
            </a>
          </div>
          <div className="flex gap-3">
            {[
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Instagram, href: '#', label: 'Instagram' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-white/20 hover:text-white"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
