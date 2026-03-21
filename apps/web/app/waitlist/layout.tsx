import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Waitlist | FairShare – Reserved Access',
  description: 'Reserve your spot in the next generation of expense sharing. Early access slots are limited.',
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
