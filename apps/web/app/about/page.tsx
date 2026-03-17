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
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            The Vision
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          NEW <br className="md:hidden" /> <span className="text-purple-600">META.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          WE ARE REDEFINING THE FABRIC OF GROUP FINANCES.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-32">
        <div className="mx-auto max-w-5xl space-y-12">
          {values.map((v, index) => (
            <div
              key={v.title}
              className={`flex flex-col gap-12 md:flex-row md:items-center glass-card p-12 relative overflow-hidden group ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-transparent pointer-events-none" />
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl group-hover:scale-110 transition-transform duration-500">
                <v.icon size={40} className="text-purple-500" />
              </div>
              <div className="text-center md:text-left flex-grow">
                <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter text-white">
                  {v.title}
                </h2>
                <p className="text-lg font-bold uppercase tracking-widest text-zinc-500 leading-relaxed max-w-2xl">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Team CTA */}
      <SectionContainer className="mb-32">
        <div className="glass-panel text-center p-16 md:p-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
          <h2 className="relative mb-8 text-5xl font-black uppercase italic tracking-tighter md:text-8xl text-white">
            JOIN THE <br className="md:hidden" /> REVOLUTION.
          </h2>
          <a
            href="/waitlist"
            className="relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-white/10"
          >
            LOCK IN YOUR SPOT
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
