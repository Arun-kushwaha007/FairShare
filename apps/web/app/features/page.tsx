'use client';

import { Activity, Layers, ReceiptText, RefreshCw, ShieldCheck, Zap, Sparkles, Users } from 'lucide-react';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { CTASection } from '../../components/marketing/CTASection';
import { FeatureCard } from '../../components/marketing/FeatureCard';
import { PageHeader } from '../../components/marketing/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';

const featureList = [
  {
    title: 'Flexible split rules',
    description: 'Split equally, assign exact amounts, or use percentages when the group did not share costs evenly.',
    iconName: 'Zap' as const,
    eyebrow: 'Dynamic Logic',
  },
  {
    title: 'Dedicated group spaces',
    description: 'Separate trips, roommates, and teams so each group has its own members, expenses, and running balance.',
    iconName: 'Users' as const,
    eyebrow: 'Isolated Context',
  },
  {
    title: 'Instant balance updates',
    description: 'See balance changes instantly across all members after a new expense or settlement is recorded.',
    iconName: 'RefreshCw' as const,
    eyebrow: 'Real-time Sync',
  },
  {
    title: 'Receipts with context',
    description: 'Attach receipts to expenses so the group can confirm the details without searching old message threads.',
    iconName: 'ShieldCheck' as const,
    eyebrow: 'Transparency',
  },
  {
    title: 'Settlement simplification',
    description: 'Reduce multiple debts into the fewest practical payments so the group can settle up with less friction.',
    iconName: 'Layers' as const,
    eyebrow: 'Smart Math',
  },
  {
    title: 'Activity visibility',
    description: 'Keep a running feed of what changed, who added it, and when the group balance moved.',
    iconName: 'Activity' as const,
    eyebrow: 'Audit Trail',
  },
];

const deepDiveSections = [
  {
    title: 'Capture clearly',
    description: 'FairShare helps the payer add the amount, choose the split method, and attach supporting details instantly.',
    icon: ReceiptText,
    label: 'Step 01',
  },
  {
    title: 'Stay in sync',
    description: 'As expenses land, balances update for the group right away. No more "who paid already?" questions.',
    icon: RefreshCw,
    label: 'Step 02',
  },
  {
    title: 'Close the loop',
    description: 'Settlement suggestions turn a complicated set of debts into a small set of easy actions.',
    icon: Layers,
    label: 'Step 03',
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-white">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-10" />
      <div className="pointer-events-none fixed top-0 left-1/4 h-[500px] w-full max-w-4xl bg-purple-600/5 blur-[120px]" />

      <SectionContainer size="spacious" className="relative pt-20">
        <PageHeader
          eyebrow="Product Features"
          title="Everything your group needs to split bills clearly."
          description="FairShare keeps shared spending organized with practical tools for logging expenses, tracking balances, and settling up faster than ever."
          centered
        />
      </SectionContainer>

      <SectionContainer size="compact">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureList.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer size="default">
        <div className="grid gap-12 lg:grid-cols-3">
          {deepDiveSections.map((section) => (
            <div key={section.title} className="relative group">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span>{section.label}</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <section.icon size={32} className="text-purple-400 mb-6 transition-transform group-hover:scale-110" />
              <h2 className="text-2xl font-extrabold tracking-tight text-white mb-4">{section.title}</h2>
              <p className="text-sm leading-8 text-zinc-400 group-hover:text-zinc-300 transition-colors">{section.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <GlassCard className="p-10 sm:p-16 lg:p-20 border-white/10 bg-black/40">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="eyebrow-label mb-6">Versatility</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                One app for every group situation.
              </h2>
              <p className="mt-8 text-lg leading-8 text-zinc-400">
                Each part of the product is designed to reduce common breakdowns: missing context, stale numbers, or unclear next steps.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'For trips', desc: 'Track meals, rides, and one-off bookings easily.' },
                { title: 'For roommates', desc: 'Keep rent, groceries, and utilities in check.' },
                { title: 'For teams', desc: 'Maintain shared records for reimbursements.' },
                { title: 'For clubs', desc: 'Manage budget contributions across members.' }
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </SectionContainer>

      <CTASection
        eyebrow="Power your group spending"
        title="Stop guessing who owes what."
        description="Join thousands of users who trust FairShare to keep their group ledgers accurate and their settlements simple."
        primaryHref="/register"
        primaryLabel="Start Splitting"
        secondaryHref="/"
        secondaryLabel="Learn More"
      />
    </main>
  );
}
