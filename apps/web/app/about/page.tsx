import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { Shield, Sparkles, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | FairShare – The Vision',
  description: 'Making shared expenses simple, fair, and transparent. Learn about our mission and tech.',
};

const values = [
  {
    title: 'Our Mission',
    description: 'MAKING SHARED EXPENSES SIMPLE, FAIR, AND TRANSPARENT. WE\'RE ELIMINATING THE "WAIT, WHO PAID FOR THIS?" AWKWARDNESS FROM EVERY GROUP CHAT.',
    icon: Sparkles,
  },
  {
    title: 'Why FairShare',
    description: 'MODERN DESIGN MEETS REAL-TIME ARCHITECTURE. WE DON\'T SETTLE FOR "GOOD ENOUGH." WE ONLY SETTLE FOR PERFECT BALANCES AND SEAMLESS VIBES.',
    icon: Zap,
  },
  {
    title: 'Technology',
    description: 'BUILT WITH NEXT.JS, TAILWIND, AND SOCKETS. OUR ENGINE IS DESIGNED FOR THE SIMULATION, SCALING WITH YOUR SQUAD FROM ONE DINNER TO A TRIP AROUND THE WORLD.',
    icon: Shield,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          THE VISION.
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
          WE ARE REDEFINING THE META OF GROUP FINANCES.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-32">
        <div className="mx-auto max-w-4xl space-y-20">
          {values.map((v, index) => (
            <div
              key={v.title}
              className={`flex flex-col gap-12 md:flex-row md:items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex h-32 w-32 shrink-0 items-center justify-center border-4 border-white bg-zinc-900 shadow-[8px_8px_0px_0px_white]">
                <v.icon size={64} className="text-yellow-400" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="mb-4 text-4xl font-black uppercase italic tracking-tighter text-white">
                  {v.title}
                </h2>
                <p className="text-xl font-bold uppercase tracking-widest text-zinc-400 leading-relaxed">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Team CTA */}
      <SectionContainer className="bg-white text-black border-y-4 border-black mb-32 text-center">
        <h2 className="mb-8 text-5xl font-black uppercase italic tracking-tighter md:text-7xl">
          JOIN THE REVOLUTION.
        </h2>
        <a
          href="/waitlist"
          className="neo-pop-hover bg-black px-12 py-6 text-2xl font-black text-white shadow-[8px_8px_0px_0px_#a855f7] transition-all"
        >
          LOCK IN YOUR SPOT
        </a>
      </SectionContainer>
    </main>
  );
}
