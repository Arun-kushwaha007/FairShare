import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | FairShare – Five Steps to Harmony',
  description: 'Learn how to split smarter and settle faster with our five-step group expense flow.',
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
