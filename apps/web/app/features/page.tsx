import type { Metadata } from 'next';
import { Activity, Layers, ReceiptText, RefreshCw, ShieldCheck, Users, Zap } from 'lucide-react';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { CTASection } from '../../components/marketing/CTASection';
import { FeatureCard } from '../../components/marketing/FeatureCard';
import { PageHeader } from '../../components/marketing/PageHeader';

export const metadata: Metadata = {
  title: 'Features | FairShare - Smart Expense Sharing',
  description: 'Explore the features that help groups track expenses, keep balances current, and settle up faster.',
};

const featureList = [
  {
    title: 'Flexible split rules',
    description: 'Split equally, assign exact amounts, or use percentages when the group did not share costs evenly.',
    iconName: 'Zap' as const,
    colorClass: 'shadow-yellow-500/20',
  },
  {
    title: 'Dedicated group spaces',
    description: 'Separate trips, roommates, and teams so each group has its own members, expenses, and running balance.',
    iconName: 'Users' as const,
    colorClass: 'shadow-cyan-500/20',
  },
  {
    title: 'Instant balance updates',
    description: 'See balance changes instantly across all members after a new expense or settlement is recorded.',
    iconName: 'RefreshCw' as const,
    colorClass: 'shadow-purple-500/20',
  },
  {
    title: 'Receipts with context',
    description: 'Attach receipts to expenses so the group can confirm the details without searching old message threads.',
    iconName: 'ShieldCheck' as const,
    colorClass: 'shadow-pink-500/20',
  },
  {
    title: 'Settlement simplification',
    description: 'Reduce multiple debts into the fewest practical payments so the group can settle up with less friction.',
    iconName: 'Layers' as const,
    colorClass: 'shadow-emerald-500/20',
  },
  {
    title: 'Activity visibility',
    description: 'Keep a running feed of what changed, who added it, and when the group balance moved.',
    iconName: 'Activity' as const,
    colorClass: 'shadow-orange-500/20',
  },
];

const detailSections = [
  {
    title: 'Capture the expense clearly',
    description:
      'FairShare helps the payer add the amount, choose the split method, and attach supporting details so everyone understands the record the first time.',
    icon: ReceiptText,
  },
  {
    title: 'Keep everyone in sync',
    description:
      'As expenses or settlements are added, balances update for the group right away. Members do not need to refresh a spreadsheet or ask for the latest total.',
    icon: RefreshCw,
  },
  {
    title: 'Close the loop faster',
    description:
      'Instead of manually tracing who owes whom, settlement suggestions turn a complicated set of debts into a smaller set of actions that are easy to complete.',
    icon: Layers,
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-white">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-10" />

      <SectionContainer size="spacious" className="relative pt-10 sm:pt-14">
        <PageHeader
          eyebrow="Features"
          title="Everything your group needs to split expenses clearly."
          description="FairShare keeps shared spending organized with practical tools for logging expenses, tracking balances, and settling up without extra back-and-forth."
        />
      </SectionContainer>

      <SectionContainer size="compact">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureList.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <div className="grid gap-5 lg:grid-cols-3">
          {detailSections.map((section) => (
            <div key={section.title} className="marketing-card p-6 sm:p-7">
              <section.icon size={22} className="text-purple-300" />
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base sm:leading-7">{section.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <div className="marketing-card p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Why it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Clear records, live balances, and less ambiguity for everyone involved.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                Each part of the product is designed to reduce one of the common breakdowns in shared expense tracking: missing context, stale numbers, or unclear next steps.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-lg font-semibold text-white">For trips and events</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Track shared bookings, meals, rides, and one-off purchases without losing sight of who covered what.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-lg font-semibold text-white">For roommates</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Keep recurring household spending visible so rent add-ons, groceries, and utilities stay easy to reconcile.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 sm:col-span-2">
                <h3 className="text-lg font-semibold text-white">For teams and clubs</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Maintain a shared record for reimbursements and group purchases when multiple people are contributing across the same budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <CTASection
          eyebrow="See FairShare in action"
          title="Start splitting expenses with a workflow people can actually follow."
          description="Create a group, add the first expense, and let FairShare keep the balances readable from there."
          primaryHref="/login"
          primaryLabel="Start Splitting"
          secondaryHref="/how-it-works"
          secondaryLabel="See How It Works"
        />
      </SectionContainer>
    </main>
  );
}
