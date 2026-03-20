'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionContainer } from '../components/layout/SectionContainer';
import { CTASection } from '../components/marketing/CTASection';
import { FeatureCard } from '../components/marketing/FeatureCard';
import { ComingSoonAppSection } from '../components/marketing/ComingSoonAppSection';
import { TrustStatsSection } from '../components/marketing/TrustStatsSection';
import { GlassCard } from '../components/ui/GlassCard';
import { AccentButton } from '../components/ui/AccentButton';

const previewFeatures = [
  {
    title: 'Track every shared expense',
    description: 'Add bills, assign who owes what, and keep the group ledger current without bouncing between messages.',
    iconName: 'ReceiptText' as const,
    eyebrow: 'Unified Ledger',
  },
  {
    title: 'Instant balance updates',
    description: 'Everyone stays aligned as new expenses land, so there is less backtracking when it is time to settle.',
    iconName: 'RefreshCw' as const,
    eyebrow: 'Live Sync',
  },
  {
    title: 'Contextual receipts',
    description: 'Keep proof attached to the expense so the group can verify details without digging through gallery screenshots.',
    iconName: 'ShieldCheck' as const,
    eyebrow: 'Verification',
  },
  {
    title: 'Simplify payments',
    description: 'FairShare reduces a messy web of debts into clear settle-up actions the group can complete quickly.',
    iconName: 'GitMerge' as const,
    eyebrow: 'Optimization',
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-10" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-4xl bg-purple-600/10 blur-[120px]" />
      
      {/* Hero Section */}
      <SectionContainer size="spacious" className="relative pt-20 sm:pt-32">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="eyebrow-label mb-8"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span>The Premium Way to Split Expenses</span>
          </motion.div>
          
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Split group expenses <span className="text-purple-500">without the chaos.</span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
            FairShare helps roommates, travelers, and teams log shared spending, track balances live, and settle up faster. No spreadsheets required.
          </p>
          
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <AccentButton href="/login" variant="primary" icon={<ArrowRight size={18} />}>
              Start Splitting Free
            </AccentButton>
            <AccentButton href="/features" variant="secondary">
              Explore Features
            </AccentButton>
          </div>
          
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.25em] text-zinc-600">
            Android & iOS App Coming Soon
          </p>
        </div>
        
        {/* Product Teaser Dashboard Image */}
        <div className="mt-20 relative px-4 sm:px-10">
          <GlassCard className="!p-0 border-white/10 bg-black/40 shadow-[0_0_100px_rgba(168,85,247,0.1)]" hoverable={false}>
            <div className="aspect-[16/9] relative bg-gradient-to-br from-purple-900/10 via-transparent to-transparent">
               {/* Dashboard Mockup Representation */}
               <div className="absolute inset-0 p-8 sm:p-12 overflow-hidden">
                 <div className="flex justify-between items-start mb-12">
                   <div className="space-y-4">
                     <div className="h-4 w-32 rounded-full bg-white/10" />
                     <div className="h-10 w-64 rounded-xl bg-white/5" />
                   </div>
                   <div className="h-12 w-12 rounded-full bg-purple-500/20 border border-purple-500/30" />
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    <div className="h-40 rounded-3xl bg-white/5 border border-white/10 p-6">
                      <div className="h-3 w-1/2 rounded-full bg-purple-400/30 mb-4" />
                      <div className="h-10 w-3/4 rounded-xl bg-white/10" />
                    </div>
                    <div className="h-40 rounded-3xl bg-white/5 border border-white/10 p-6">
                      <div className="h-3 w-1/2 rounded-full bg-purple-400/30 mb-4" />
                      <div className="h-10 w-3/4 rounded-xl bg-white/10" />
                    </div>
                    <div className="h-40 rounded-3xl bg-purple-600/10 border border-purple-500/20 p-6">
                      <div className="h-3 w-1/2 rounded-full bg-purple-400/40 mb-4" />
                      <div className="h-10 w-3/4 rounded-xl bg-white/10" />
                    </div>
                 </div>
               </div>
            </div>
            {/* Skeuomorphic Glass Light Leak */}
            <div className="absolute -top-px -left-px -right-px h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          </GlassCard>
          
          {/* Floating Accents */}
          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-purple-900/30 blur-3xl" />
        </div>
      </SectionContainer>

      {/* Social Proof */}
      <TrustStatsSection />

      {/* Problem/Solution Card Grid */}
      <SectionContainer size="compact">
        <div className="grid gap-8 lg:grid-cols-2">
          <GlassCard className="p-8 sm:p-10 border-red-500/10 bg-red-500/[0.02]">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400/60 mb-4 block">The Friction</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Manual tracking causes headaches for everyone.
            </h2>
            <ul className="mt-8 space-y-6">
              {[
                'Expenses get logged late, leading to balance drift.',
                'Lost receipts cause arguments over price details.',
                'Complex settle-up math adds unnecessary friction.'
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start text-zinc-400">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/40 shrink-0" />
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
          
          <GlassCard className="p-8 sm:p-10 border-purple-500/20 bg-purple-500/[0.04]">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-400 mb-4 block">The Solution</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              FairShare automates the busywork of group spending.
            </h2>
            <ul className="mt-8 space-y-6">
              {[
                'Members see balance changes instantly after each log.',
                'Proof stays attached to the record for total transparency.',
                'Optimized settlements reduce the number of payments.'
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start text-zinc-300">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </SectionContainer>

      {/* Feature Grid */}
      <SectionContainer id="features">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow-label mb-6">Core Features</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Everything you need, nothing you don&apos;t.
            </h2>
          </div>
          <Link href="/features" className="group flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors">
            Explore Full Feature Set
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {previewFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </SectionContainer>

      {/* Mobile Teaser */}
      <ComingSoonAppSection />

      {/* Final CTA */}
      <CTASection
        eyebrow="Join the future of group finances"
        title="Ready to stop the manual math?"
        description="FairShare gives your group the fastest path from logging a bill to settling balances clearly. Start splitting better today."
        primaryHref="/register"
        primaryLabel="Start Splitting Free"
        secondaryHref="/features"
        secondaryLabel="View Features"
      />
    </main>
  );
}
