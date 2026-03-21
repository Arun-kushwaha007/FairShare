import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | FairShare – The Vision',
  description: 'Making shared expenses simple, fair, and transparent. Learn about our mission and the technology behind the protocol.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
