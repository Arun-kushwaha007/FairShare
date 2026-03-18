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
    iconName: 'Zap' as const,
    colorClass: 'shadow-yellow-500/20',
  },
  {
    title: 'Groups Everywhere',
    description: 'Manage trips, roommates, and teams in dedicated spaces. Perfect for any shared living or travel situation.',
    iconName: 'Users' as const,
    colorClass: 'shadow-cyan-500/20',
  },
  {
    title: 'Real-Time Sync',
    description: 'Balances update instantly across all devices. No more "I thought I paid that" conversations.',
    iconName: 'RefreshCw' as const,
    colorClass: 'shadow-purple-500/20',
  },
  {
    title: 'Receipt Uploads',
    description: 'Attach receipts to expenses for proof. Cloud-based storage ensures you never lose a paper trail.',
    iconName: 'Shield' as const,
    colorClass: 'shadow-pink-500/20',
  },
  {
    title: 'Debt Simplification',
    description: 'Reduce multiple payments into a single efficient settlement. We find the shortest path to zero.',
    iconName: 'Layers' as const,
    colorClass: 'shadow-green-500/20',
  },
  {
    title: 'Realtime Updates',
    description: 'Socket events update group activity instantly. Get notified the second an expense is added.',
    iconName: 'Activity' as const,
    colorClass: 'shadow-orange-500/20',
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            Protocol Mechanics
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          POWER <br className="md:hidden" /> <span className="text-purple-600">SYSTEM.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          ENGINEERED FOR SUPREME FINANCIAL CLARITY WITHIN YOUR SQUAD.
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
      <SectionContainer className="mb-32">
        <div className="glass-panel text-center p-16 md:p-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
          <h2 className="relative mb-8 text-5xl font-black uppercase italic tracking-tighter md:text-8xl text-white">
            READY TO <br className="md:hidden" /> LEVEL UP?
          </h2>
          <a
            href="/waitlist"
            className="relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-white/10"
          >
            JOIN THE SQUAD
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
