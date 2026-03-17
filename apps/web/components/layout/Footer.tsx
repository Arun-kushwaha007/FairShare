import Link from 'next/link';
import Image from 'next/image';
import { Send, Rocket, Twitter, Github, Instagram } from 'lucide-react';

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
  Legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative bg-[#030303] pt-32 pb-16 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-8">
        <div className="grid gap-16 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-8 flex items-center gap-4 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Image 
                  src="/logo.png" 
                  alt="FairShare Logo" 
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-3xl font-black italic tracking-tighter text-white">
                FAIRSHARE
              </span>
            </Link>
            <p className="mb-8 text-sm font-bold uppercase tracking-widest text-zinc-500 leading-relaxed max-w-[240px]">
              SUPREME EXPENSE SHARING <br />
              FOR THE MODERN SQUAD. <br />
              <span className="text-white">NO CAP. NO STRESS.</span>
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              COMING SOON TO MOBILE
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                  {category}
                </h3>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/40 transition-colors hover:text-purple-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Support / Help */}
            <div>
              <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                Support
              </h3>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li>
                  <a
                    href="mailto:support@fairsharee.com"
                    className="flex items-center gap-2 text-white/40 transition-colors hover:text-purple-400 group"
                  >
                    MAIL SUPPORT <Send size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-white/40 transition-colors hover:text-purple-400"
                  >
                    HELP CENTER
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            © 2026 FAIRSHARE — HANDCRAFTED IN THE SIMULATION.
          </p>
          <div className="flex justify-center gap-6">
            {[
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Instagram, href: '#', label: 'Instagram' }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                aria-label={social.label}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
