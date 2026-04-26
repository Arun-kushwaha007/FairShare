import './globals.css';
import './theme.css';
import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Providers } from '../src/components/Providers';
import { themeStylesheet } from '../src/design/theme';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CookieConsent } from '../src/components/ui/CookieConsent';

export const metadata: Metadata = {
  title: 'FairShare - Smart Expense Sharing',
  description: 'Split group expenses without confusion. FairShare helps friends, roommates, and teams track shared spending and settle up faster.',
  keywords: ['expense sharing', 'group expenses', 'split bills', 'settle up', 'fairshare'],
  openGraph: {
    title: 'FairShare - Smart Expense Sharing',
    description: 'Split group expenses without confusion. FairShare helps groups track spending and settle balances faster.',
    url: 'https://fairshare.app',
    siteName: 'FairShare',
    type: 'website',
    images: [
      {
        url: 'https://fairshare.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FairShare - Smart Expense Sharing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FairShare - Smart Expense Sharing',
    description: 'Split group expenses without confusion. FairShare helps groups track spending and settle balances faster.',
    images: ['https://fairshare.app/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        <style id="fs-theme-vars">{themeStylesheet}</style>
      </head>
      <body className="min-h-screen selection:bg-[var(--fs-primary)] selection:text-white">
        <Providers>
          <Navbar />
          <div>{children}</div>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
