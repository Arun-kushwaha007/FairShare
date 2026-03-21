import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | FairShare – Protocol Intelligence',
  description: 'Common questions about expense splitting, settlements, security, and our open-source mission.',
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
