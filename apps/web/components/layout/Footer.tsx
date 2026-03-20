import Link from 'next/link';
import { Sparkles, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { SectionContainer } from './SectionContainer';

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Waitlist', href: '/waitlist' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com/fairshare', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/fairshare', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/fairshare', icon: Linkedin },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030303] pt-20 pb-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      
      <SectionContainer size="spacious">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105 active:scale-95">
                <Sparkles size={18} className="text-white" />
                <div className="absolute inset-0 rounded-xl border border-white/20" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Fair<span className="text-purple-400">Share</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-7 text-zinc-400">
              The premium way to track group expenses, split bills, and settle up without the spreadsheet headache.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.social.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-zinc-400 transition-colors hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Product</h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Company</h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Legal</h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} FairShare. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-zinc-500 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-zinc-500 transition-colors hover:text-white">
              Terms of Service
            </Link>
            <a 
              href="mailto:hello@fairsharee.com" 
              className="inline-flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-white"
            >
              <Mail size={14} />
              hello@fairsharee.com
            </a>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
