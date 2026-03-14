import './globals.css';
import './theme.css';
import type { Metadata } from 'next';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-grid min-h-screen">{children}</body>
    </html>
  );
}