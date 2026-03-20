import { GlassCard } from '../ui/GlassCard';
import { Smartphone, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { SectionContainer } from '../layout/SectionContainer';
import { AppStoreButtons } from './AppStoreButtons';

const mobileFeatures = [
  { icon: Smartphone, text: 'Real-time notifications' },
  { icon: Zap, text: 'Quick settle-up flows' },
  { icon: ShieldCheck, text: 'Secure receipt uploads' },
  { icon: Sparkles, text: 'Biometric security' },
];

export function ComingSoonAppSection() {
  return (
    <SectionContainer id="mobile" size="default">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="eyebrow-label mb-6">Mobile Apps</span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Coming soon to <span className="text-purple-400">iOS</span> and <span className="text-purple-400">Android</span>.
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Take FairShare wherever you go. Log expenses instantly at dinner, during trips, or at the grocery store. Join the waitlist for early access.
          </p>
          
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {mobileFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-zinc-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <feature.icon size={16} className="text-purple-400" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-12 scale-90 origin-left opacity-80 filter grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <AppStoreButtons />
          </div>
        </div>
        
        <div className="relative">
          <GlassCard className="!p-0 border-white/10 bg-black/40 overflow-hidden" hoverable={false}>
            <div className="aspect-[4/5] relative bg-gradient-to-b from-purple-500/10 to-transparent">
              {/* This would be an image/mockup placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-12 text-center">
                  <Smartphone className="mx-auto text-purple-400/30 mb-6" size={120} strokeWidth={1} />
                  <p className="text-xl font-bold text-zinc-600">Premium App Interface Mockup</p>
                </div>
              </div>
              
              {/* Floating UI elements for depth */}
              <div className="absolute top-1/4 -right-10 h-32 w-64 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-3/4 rounded-full bg-white/10" />
                    <div className="h-2 w-1/2 rounded-full bg-white/5" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 -left-10 h-32 w-64 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-3 w-1/2 rounded-full bg-purple-500/40" />
                  <div className="h-6 w-full rounded-xl bg-white/10" />
                </div>
              </div>
            </div>
          </GlassCard>
          
          {/* Decorative glow */}
          <div className="absolute inset-0 -z-10 bg-purple-500/10 blur-[120px]" />
        </div>
      </div>
    </SectionContainer>
  );
}
