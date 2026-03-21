import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | FairShare – No Cap Pricing',
  description: 'Keep it simple with our free tier, or unlock Pro features for $0 via system override.',
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
