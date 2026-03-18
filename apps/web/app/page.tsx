'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveRight, CheckCircle2, Zap, Shield, TrendingUp, Rocket } from 'lucide-react';
import Link from 'next/link';
import { AppStoreButtons } from '../components/marketing/AppStoreButtons';
import { SectionContainer } from '../components/layout/SectionContainer';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { text: 'Smart expense splits', icon: Zap, color: 'text-yellow-400' },
  { text: 'Automatic balance tracking', icon: TrendingUp, color: 'text-cyan-400' },
  { text: 'Settle-up suggestions', icon: CheckCircle2, color: 'text-purple-400' },
  { text: 'Receipt uploads', icon: Shield, color: 'text-pink-400' },
];

const stats = [
  { label: 'Active Users', value: '10K+', description: 'Growing squad' },
  { label: 'Settle Ups', value: '$2M+', description: 'Total debt cleared' },
  { label: 'Latency', value: '100ms', description: 'Real-time sync' },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.hero-title span', {
        y: 100,
        opacity: 0,
        rotateX: -45,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
      });

      gsap.from('.hero-sub', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      });

      gsap.from('.hero-cta', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: 'back.out(1.7)',
      });

      // Stats Stagger
      gsap.from('.stat-card', {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#030303] overflow-hidden">
      {/* Grid Background Overlay */}
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none opacity-20" />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Next-Gen Shared Finances
            </div>
          </div>
          
          <h1 className="hero-title text-6xl md:text-8xl lg:text-[10rem] font-black italic tracking-tighter leading-[0.8] mb-8 select-none">
            <span className="inline-block text-white">FAIR</span>
            <span className="inline-block text-purple-600">SHARE</span>
          </h1>

          <p className="hero-sub mx-auto max-w-2xl text-lg md:text-2xl font-bold uppercase tracking-widest text-zinc-500 mb-12">
            REDEFINING THE <span className="text-white italic underline decoration-purple-500/50 decoration-4 underline-offset-8">META</span> OF GROUP EXPENSES. 
            <br className="hidden md:block" />
            NO MATH. NO STRESS. JUST VIBES.
          </p>

          <div className="hero-cta flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href="/login"
              className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-white/10"
            >
              START SPLITTING <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </a>
            <a
              href="/features"
              className="flex items-center gap-3 px-10 py-5 border border-white/10 bg-white/5 backdrop-blur-md text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
            >
              EXPLORE TECH
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <SectionContainer className="stats-section border-y border-white/5 bg-white/[0.02]">
        <div className="grid gap-12 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card text-center group">
              <div className="text-5xl font-black italic tracking-tighter text-white mb-2 group-hover:text-purple-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
                {stat.label}
              </div>
              <p className="text-sm font-bold text-zinc-600 uppercase">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </SectionContainer> */}

      {/* Features Grid */}
      <SectionContainer id="features">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-6 uppercase">
              POWER <br /> MECHANICS.
            </h2>
            <p className="text-lg font-bold uppercase tracking-widest text-zinc-500">
              WE BUILT THE TOOLS. YOU JUST HAVE THE FUN. 
              ELIMINATE THE FINANCIAL FRICTION IN YOUR SQUAD.
            </p>
          </div>
          <Link href="/features" className="text-sm font-black uppercase tracking-[0.2em] text-purple-400 hover:text-white transition-colors border-b-2 border-purple-400/30 pb-2">
            SEE ALL FEATURES
          </Link>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={item.text}
              className="glass-card p-10 group hover:bg-white/5 transition-all"
            >
              <item.icon size={40} className={`mb-8 ${item.color} group-hover:scale-110 transition-transform`} />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">
                {item.text}
              </h3>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* App Promo */}
      <SectionContainer className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-purple-900/20 to-black p-0">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="relative px-8 py-20 md:px-20 md:py-32 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-purple-500/40">
            <Rocket className="text-white" size={40} />
          </div>
          <h2 className="text-5xl md:text-[5rem] font-black italic tracking-tighter text-white mb-8 leading-none">
            MOBILE INCOMING.
          </h2>
          <p className="max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400 mb-12">
            The smoothest sharing experience is hitting the stores. Android and iOS support is locked in.
          </p>
          <AppStoreButtons />
        </div>
      </SectionContainer>

      {/* Comparison Preview (Reduced Brutalism) */}
      <SectionContainer>
        <div className="glass-panel p-12 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 select-none">
            <TrendingUp size={200} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-16 uppercase">
            UPGRADING THE <br /> STATUS QUO.
          </h2>
          
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="text-zinc-500 font-black uppercase tracking-widest text-xs">Standard</div>
              <p className="text-xl font-bold text-zinc-400 uppercase">Manual math, passive-aggressive requests, lost receipts.</p>
            </div>
            <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 ring-4 ring-white/5">
              <div className="text-purple-400 font-black uppercase tracking-widest text-xs">FairShare</div>
              <p className="text-xl font-bold text-white uppercase italic">Instant sync, AI parsing, one-tap settlement. Pure flow.</p>
            </div>
            <div className="space-y-4">
              <div className="text-zinc-500 font-black uppercase tracking-widest text-xs">Spreadsheets</div>
              <p className="text-xl font-bold text-zinc-400 uppercase">Broken formulas, desktop only, Zero mobility.</p>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Newsletter Refinement */}
      <SectionContainer id="waitlist" className="mb-20">
        <div className="glass-panel px-8 py-20 md:px-20 md:py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
          <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white mb-8 leading-none">
            LOCK IN.
          </h2>
          <p className="max-w-xl mx-auto text-lg font-bold uppercase tracking-widest text-zinc-500 mb-16">
            Join the waitlist for early access to the Pro engine and stop the group chat static.
          </p>
          <form className="relative flex flex-col gap-4 md:flex-row md:justify-center max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.XYZ" 
              className="w-full border-2 border-white/10 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase placeholder-zinc-500 outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all" 
            />
            <button 
              type="submit"
              className="whitespace-nowrap px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              JOIN SQUAD
            </button>
          </form>
        </div>
      </SectionContainer>
    </main>
  );
}

