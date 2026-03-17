import './globals.css';
import './theme.css';
import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Providers } from '../src/components/Providers';
import { themeStylesheet } from '../src/design/theme';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const themeInitScript = `
(function() {
  try {
    const storageKey = 'fs-theme';
    const stored = localStorage.getItem(storageKey);
    const mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
    document.documentElement.dataset.theme = resolved;
    document.body.dataset.theme = resolved;
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    document.body.dataset.theme = 'light';
  }
})();
`;

export const metadata: Metadata = {
  title: 'FairShare – Smart Expense Sharing',
  description: 'Split bills with friends easily. Coming soon on Android and iOS.',
  keywords: ['expense sharing', 'group expenses', 'split bills', 'settle up', 'fairshare'],
  openGraph: {
    title: 'FairShare – Smart Expense Sharing',
    description: 'Split bills with friends easily. Coming soon on Android and iOS.',
    url: 'https://fairsharee.com',
    siteName: 'FairShare',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        <style id="fs-theme-vars">{themeStylesheet}</style>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
        <Providers>
          <Navbar />
          <div className="pt-20">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
