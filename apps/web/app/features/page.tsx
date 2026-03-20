'use client';

import { motion } from 'framer-motion';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { CTASection } from '../../components/marketing/CTASection';
import { FeaturesHero } from './FeaturesHero';
import { FeatureGrid } from './FeatureGrid';
import { FeatureProcess } from './FeatureProcess';
import { FeatureUseCases } from './FeatureUseCases';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-white">
      {/* ── Background Infrastructure ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.03),transparent_70%)]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} 
        />
      </div>

      <div className="relative z-10 space-y-2 pb-2">
        <SectionContainer >
          <FeaturesHero />
        </SectionContainer>

        <SectionContainer size="default">
          <FeatureGrid />
        </SectionContainer>

        <SectionContainer size="default">
          <FeatureProcess />
        </SectionContainer>

        <SectionContainer size="default">
          <FeatureUseCases />
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
      </div>
    </main>
  );
}
