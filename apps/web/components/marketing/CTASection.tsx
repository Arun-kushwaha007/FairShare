import { SectionContainer } from '../layout/SectionContainer';
import { AccentButton } from '../ui/AccentButton';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <SectionContainer size="compact">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-purple-900/40 via-black to-zinc-900/40 p-10 sm:p-16 lg:p-24">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-purple-900/20 blur-[100px]" />
        
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {eyebrow && (
            <span className="eyebrow-label mb-8">
              {eyebrow}
            </span>
          )}
          
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          
          <p className="mt-8 text-lg leading-8 text-zinc-400">
            {description}
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AccentButton href={primaryHref} variant="primary" icon={<ArrowRight size={18} />}>
              {primaryLabel}
            </AccentButton>
            {secondaryLabel && secondaryHref && (
              <AccentButton href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </AccentButton>
            )}
          </div>
          
          <p className="mt-8 text-sm text-zinc-500">
            Join thousands of groups already using FairShare.
          </p>
        </div>
        
        {/* Bottom Skeuomorphic Edge */}
        <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>
    </SectionContainer>
  );
}
