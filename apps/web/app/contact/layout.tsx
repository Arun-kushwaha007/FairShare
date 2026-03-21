import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | FairShare – Hit Us Up',
  description: 'Whether you have a bug report or just want to say hi, our squad is standing by. Reach out through our direct transmission channels.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
