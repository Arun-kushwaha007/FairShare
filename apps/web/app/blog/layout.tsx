import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Log | FairShare – Engineering & Social Finance',
  description: 'Deep dives into real-time sync, group dynamics, and the future of social finance.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
