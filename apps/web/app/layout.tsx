import './globals.css';
import './theme.css';
import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Providers } from '../src/components/Providers';
import { themeStylesheet } from '../src/design/theme';

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
  title: 'FairShare | Smart Group Expense Sharing',
  description: 'Track shared expenses, simplify debts, and settle quickly with FairShare.',
  keywords: ['expense sharing', 'group expenses', 'split bills', 'settle up'],
  openGraph: {
    title: 'FairShare',
    description: 'Smart group expense sharing app.',
    type: 'website',
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
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
