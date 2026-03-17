import { Zap, Users, RefreshCw, Shield, Layers, Activity } from 'lucide-react';
import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { FeatureCard } from '../../components/marketing/FeatureCard';

export const metadata: Metadata = {
  title: 'Features | FairShare – Smart Expense Sharing',
  description: 'Explore our powerful mechanics: Smart splitting, real-time sync, receipt uploads, and more.',
};

const featureList = [
  {
    title: 'Smart Expense Splitting',
    description: 'Split equally, by exact amounts, or percentages. Our engine handles the math so you don\'t have to.',
    icon: Zap,
    colorClass: 'hover:border-yellow-400 hover:shadow-[8px_8px_0px_0px_rgba(234,179,8,1)]',
  },
  {
    title: 'Groups Everywhere',
    description: 'Manage trips, roommates, and teams in dedicated spaces. Perfect for any shared living or travel situation.',
    icon: Users,
    colorClass: 'hover:border-cyan-400 hover:shadow-[8px_8px_0px_0px_rgba(6,182,212,1)]',
  },
  {
    title: 'Real-Time Sync',
    description: 'Balances update instantly across all devices. No more "I thought I paid that" conversations.',
    icon: RefreshCw,
    colorClass: 'hover:border-purple-400 hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]',
  },
  {
    title: 'Receipt Uploads',
    description: 'Attach receipts to expenses for proof. Cloud-based storage ensures you never lose a paper trail.',
    icon: Shield,
    colorClass: 'hover:border-pink-500 hover:shadow-[8px_8px_0px_0px_rgba(236,72,153,1)]',
  },
  {
    title: 'Debt Simplification',
    description: 'Reduce multiple payments into a single efficient settlement. We find the shortest path to zero.',
    icon: Layers,
    colorClass: 'hover:border-green-400 hover:shadow-[8px_8px_0px_0px_rgba(74,222,128,1)]',
  },
  {
    title: 'Realtime Updates',
    description: 'Socket events update group activity instantly. Get notified the second an expense is added.',
    icon: Activity,
    colorClass: 'hover:border-orange-400 hover:shadow-[8px_8px_0px_0px_rgba(251,146,60,1)]',
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          CORE MECHANICS
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
          POWERFUL FEATURES DESIGNED FOR THE MODERN SQUAD.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-32">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              index={index}
              {...feature}
            />
          ))}
        </div>
      </SectionContainer>

      {/* Secondary CTA */}
      <SectionContainer className="bg-zinc-900 border-y-4 border-white mb-32">
        <div className="text-center">
          <h2 className="mb-8 text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
            READY TO LEVEL UP?
          </h2>
          <a
            href="/waitlist"
            className="neo-pop-hover neo-pop-hover-yellow inline-flex items-center gap-3 border-4 border-white bg-yellow-400 px-12 py-6 text-2xl font-black text-black transition-all hover:bg-transparent hover:text-white"
          >
            JOIN THE WAITLIST
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
