import Link from 'next/link';
import { Send } from 'lucide-react';

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
    <footer className="border-t-4 border-white bg-black pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-8 block">
              <span className="text-3xl font-black italic tracking-tighter text-white">
                FAIRSHARE
              </span>
            </Link>
            <p className="mb-6 font-bold uppercase tracking-widest text-zinc-400">
              Smart expense sharing.
              <br />
              <span className="text-white">No cap. No stress.</span>
            </p>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              COMING SOON TO IOS & ANDROID
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                  {category}
                </h3>
                <ul className="space-y-4 font-bold uppercase tracking-widest">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white transition-colors hover:text-yellow-400"
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
              <h3 className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                Support
              </h3>
              <ul className="space-y-4 font-bold uppercase tracking-widest">
                <li>
                  <a
                    href="mailto:support@fairsharee.com"
                    className="flex items-center gap-2 text-white transition-colors hover:text-cyan-400"
                  >
                    Contact Support <Send size={14} />
                  </a>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-white transition-colors hover:text-cyan-400"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t-2 border-zinc-900 pt-10 text-center md:flex md:items-center md:justify-between">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            © 2026 FAIRSHARE — HANDCRAFTED IN THE SIMULATION.
          </p>
          <div className="mt-6 flex justify-center gap-6 md:mt-0">
            <a href="#" className="font-black text-zinc-500 hover:text-white transition-colors">TWITTER</a>
            <a href="#" className="font-black text-zinc-500 hover:text-white transition-colors">INSTAGRAM</a>
            <a href="#" className="font-black text-zinc-500 hover:text-white transition-colors">GITHUB</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
