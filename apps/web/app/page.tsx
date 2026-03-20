'use client';

import {
  GridBackground,
  FloatingOrb,
  HeroSection,
  ProblemSolutionSection,
  HowItWorksSection,
  FeatureGridSection,
  SecurityStripSection,
} from '../components/home';
// import { TrustStatsSection } from '../components/marketing/TrustStatsSection';
import { ComingSoonAppSection } from '../components/marketing/ComingSoonAppSection';
import { CTASection } from '../components/marketing/CTASection';

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#030303] text-white"
      style={{ perspective: '1200px' }}
    >
      {/* ── Persistent Grid Background ── */}
      <GridBackground />

      {/* ── Floating Orbs ── */}
      <FloatingOrb className="top-[10%] left-[8%] h-72 w-72 bg-purple-600/8 blur-[100px]" delay={0} />
      <FloatingOrb className="top-[40%] right-[5%] h-96 w-96 bg-purple-800/6 blur-[120px]" delay={2} />
      <FloatingOrb className="top-[70%] left-[15%] h-64 w-64 bg-indigo-600/6 blur-[100px]" delay={4} />

      {/* Sections */}
      <HeroSection />
      {/* <TrustStatsSection /> */}
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FeatureGridSection />
      <SecurityStripSection />
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
