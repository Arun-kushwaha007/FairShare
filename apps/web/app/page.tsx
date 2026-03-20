import { ArrowRight, CheckCircle2, Clock3, CreditCard, ShieldCheck, Smartphone, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { SectionContainer } from '../components/layout/SectionContainer';
import { AppStoreButtons } from '../components/marketing/AppStoreButtons';
import { CTASection } from '../components/marketing/CTASection';
import { FeatureCard } from '../components/marketing/FeatureCard';

const previewFeatures = [
  {
    title: 'Track every shared expense in one place',
    description: 'Add bills, assign who owes what, and keep the group ledger current without bouncing between messages.',
    iconName: 'ReceiptText' as const,
    colorClass: 'shadow-yellow-500/20',
  },
  {
    title: 'See balances change instantly across members',
    description: 'Everyone stays aligned as new expenses land, so there is less backtracking when it is time to settle.',
    iconName: 'RefreshCw' as const,
    colorClass: 'shadow-cyan-500/20',
  },
  {
    title: 'Upload receipts when context matters',
    description: 'Keep proof attached to the expense so the group can verify details without digging through gallery screenshots.',
    iconName: 'ShieldCheck' as const,
    colorClass: 'shadow-purple-500/20',
  },
  {
    title: 'Simplify payments down to the fewest moves',
    description: 'FairShare reduces a messy web of debts into clear settle-up actions the group can complete quickly.',
    iconName: 'GitMerge' as const,
    colorClass: 'shadow-emerald-500/20',
  },
];

const productSignals = [
  {
    title: 'Group summary',
    description: 'See total spend, who is owed, and who needs to settle without opening multiple tabs.',
    icon: Users,
  },
  {
    title: 'Expense timeline',
    description: 'Every charge, receipt, and note sits in a single running record the whole group can inspect.',
    icon: CreditCard,
  },
  {
    title: 'Settlement prompts',
    description: 'Get a clear next action instead of manually figuring out who should pay whom.',
    icon: CheckCircle2,
  },
];

const proofItems = [
  'Built for trips, roommates, clubs, and small teams',
  'Clearer than spreadsheets and easier than manual reminders',
  'Real-time updates reduce “who already paid?” confusion',
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-10" />

      <SectionContainer size="spacious" className="relative pt-12 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="max-w-3xl">
            <span className="eyebrow-label">Shared expense tracking for groups</span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Split group expenses without confusion.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              FairShare helps roommates, trips, and teams log shared spending, track balances live, and settle up faster without spreadsheet cleanup.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link href="/login" className="btn-royal inline-flex items-center gap-2">
                Start Splitting
                <ArrowRight size={16} />
              </Link>
              <Link href="/how-it-works" className="btn-secondary">
                See How It Works
              </Link>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              Built for everyday group spending, from rent and groceries to travel plans and event costs.
            </p>
          </div>

          <div className="marketing-card relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.1),transparent_28%)]" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Weekend trip</p>
                  <p className="mt-1 text-lg font-semibold text-white">5 people, 12 expenses</p>
                </div>
                <Sparkles className="text-purple-300" size={20} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-zinc-400">You are owed</p>
                  <p className="mt-2 text-3xl font-bold text-white">$84</p>
                  <p className="mt-2 text-sm text-emerald-300">2 members need to settle</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-zinc-400">Latest update</p>
                  <p className="mt-2 text-lg font-semibold text-white">Dinner added by Maya</p>
                  <p className="mt-2 text-sm text-zinc-400">Balances refreshed instantly</p>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Suggested settlement</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Chris pays Maya $32 and Jo pays Alex $18 to bring the group back to even.
                    </p>
                  </div>
                  <CheckCircle2 className="mt-1 text-emerald-300" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="marketing-card p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">The problem</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shared spending breaks down when the group relies on memory and chat threads.
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-300">
              <li className="flex gap-3"><Clock3 className="mt-1 shrink-0 text-zinc-500" size={16} />Expenses get logged late, so balances drift.</li>
              <li className="flex gap-3"><Clock3 className="mt-1 shrink-0 text-zinc-500" size={16} />Receipts disappear, leaving people to argue over details.</li>
              <li className="flex gap-3"><Clock3 className="mt-1 shrink-0 text-zinc-500" size={16} />Manual settle-up math creates extra payments and extra friction.</li>
            </ul>
          </div>
          <div className="marketing-card p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-300">The solution</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              FairShare gives the group one place to log expenses, verify context, and act on the next step.
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-300">
              <li className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-emerald-300" size={16} />Members see balance changes instantly after each expense.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-emerald-300" size={16} />Receipts stay attached to the record when clarification is needed.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-emerald-300" size={16} />Settlement suggestions reduce the number of payments to finish the job.</li>
            </ul>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="features" size="default">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Core features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The essentials a group needs to stay aligned.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              Focused features, clear outcomes, and enough context to settle up without second-guessing the numbers.
            </p>
          </div>
          <Link href="/features" className="text-sm font-semibold text-purple-300 transition-colors hover:text-purple-200">
            Explore every feature
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {previewFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <div className="marketing-card p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Product preview</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A cleaner workflow from first expense to final settlement.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                The interface is organized around the actions groups repeat most: adding expenses, checking balances, and closing the loop on what is still owed.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {productSignals.map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                  <item.icon className="text-purple-300" size={20} />
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="waitlist" size="compact">
        <div className="marketing-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Mobile coming soon</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Coming soon on Android and iOS.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                Join the waitlist to get early access when the mobile experience is ready, and be first in line for shared spending on the go.
              </p>
              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link href="/waitlist" className="btn-royal inline-flex items-center gap-2">
                  Join the waitlist
                  <ArrowRight size={16} />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <Smartphone size={16} />
                  Mobile notifications and quick settle-up flows
                </span>
              </div>
            </div>
            <AppStoreButtons />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <div className="marketing-card p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Social proof placeholder</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built for the moments when shared spending gets messy fast.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                This section is ready for future testimonials, usage stats, or partner logos. For now it reinforces the practical situations FairShare is designed to solve.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {proofItems.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer size="compact">
        <CTASection
          eyebrow="Ready to stop the math"
          title="Start tracking shared expenses with less friction."
          description="FairShare gives your group a faster path from logging a bill to settling balances clearly."
          primaryHref="/login"
          primaryLabel="Start Splitting"
          secondaryHref="/how-it-works"
          secondaryLabel="See How It Works"
        />
      </SectionContainer>
    </main>
  );
}
