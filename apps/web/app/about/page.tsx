'use client';

import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, ArrowRight, Command, Target, Cpu } from 'lucide-react';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { GridBackground, FloatingOrb } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';

const values = [
  {
    title: 'Our Mission',
    subtitle: 'THE SOCIAL PROTOCOL',
    description: 'MAKING SHARED EXPENSES SIMPLE, FAIR, AND TRANSPARENT. WE\'RE ELIMINATING THE "WAIT, WHO PAID FOR THIS?" AWKWARDNESS FROM EVERY GROUP CHAT.',
    icon: Sparkles,
    gradient: 'from-purple-500/20 to-transparent',
  },
  {
    title: 'Why FairShare',
    subtitle: 'ENGINEERING VIBES',
    description: 'MODERN DESIGN MEETS REAL-TIME ARCHITECTURE. WE DON\'T SETTLE FOR "GOOD ENOUGH." WE ONLY SETTLE FOR PERFECT BALANCES AND SEAMLESS VIBES.',
    icon: Zap,
    gradient: 'from-amber-500/10 to-transparent',
  },
  {
    title: 'Technology',
    description: 'BUILT WITH NEXT.JS, TAILWIND, AND SOCKETS. OUR ENGINE IS DESIGNED FOR THE SIMULATION, SCALING WITH YOUR SQUAD FROM ONE DINNER TO A TRIP AROUND THE WORLD.',
    icon: Cpu,
    gradient: 'from-blue-500/10 to-transparent',
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30">
      <GridBackground />
      
      {/* Floating Ambient Effects */}
      <FloatingOrb className="top-[5%] right-[10%] h-[500px] w-[500px] bg-purple-600/5 blur-[120px]" delay={0} />
      <FloatingOrb className="bottom-[10%] left-[5%] h-[400px] w-[400px] bg-indigo-600/5 blur-[100px]" delay={3} />

      <SectionContainer className="relative pt-44 text-center sm:pt-52">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-10">
            <div className="eyebrow-label bg-purple-500/5 text-purple-400 border-purple-500/20 px-6">
              <Target size={12} className="text-purple-400/50" />
              <span>The Vision</span>
            </div>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7.5rem] leading-[0.8] uppercase mb-10"
          >
            NEW <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">META.</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-[0.25em] text-zinc-500"
          >
            WE ARE REDEFINING THE FABRIC OF GROUP FINANCES.
          </motion.p>
        </motion.div>
      </SectionContainer>

      <SectionContainer className="relative pb-48">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-5xl space-y-24"
        >
          {values.map((v, index) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              className={`flex flex-col gap-16 md:flex-row md:items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <GlassCard className="group relative overflow-hidden p-1 bg-white/[0.01] border-white/5 hover:border-purple-500/20 transition-colors duration-700">
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-40`} />
                  <div className="relative z-10 p-12 flex items-center justify-center min-h-[300px]">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-700" />
                      <v.icon size={80} strokeWidth={1} className="relative text-white group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                </GlassCard>
              </div>
              
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400/60">
                  <Command size={10} />
                  <span>{v.subtitle || 'System Protocol'}</span>
                </div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter md:text-6xl text-white">
                  {v.title}
                </h2>
                <div className="h-px w-20 bg-gradient-to-r from-purple-500 to-transparent hidden md:block" />
                <p className="text-lg font-bold uppercase tracking-widest text-zinc-500 leading-relaxed max-w-lg">
                  {v.description}
                </p>
                <div className="pt-4 flex justify-center md:justify-start">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 pointer-events-none opacity-50"
                  >
                    <span>Read Protocol</span>
                    <ArrowRight size={12} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </SectionContainer>

      {/* Manifesto Quote */}
      <SectionContainer className="relative pb-48 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-12 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 text-purple-400">
            <Shield size={24} />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
            "We believe group finances shouldn't be a source of stress, but a catalyst for more shared experiences."
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-zinc-800" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">The FairShare Manifesto</p>
            <div className="h-px w-12 bg-zinc-800" />
          </div>
        </motion.div>
      </SectionContainer>

      {/* Revolution CTA */}
      <SectionContainer className="pb-48">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-indigo-900/10 via-black to-purple-900/10 p-16 md:p-32 text-center shadow-3xl"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="mb-12 text-5xl font-black uppercase italic tracking-tighter md:text-8xl lg:text-9xl text-white">
              JOIN THE <span className="text-zinc-800 outline-text">REVOLUTION.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <AccentButton 
                href="/waitlist" 
                variant="primary" 
                className="h-16 px-12 text-lg"
                icon={<ArrowRight size={20} />}
              >
                LOCK IN YOUR SPOT
              </AccentButton>
            </div>
          </div>
        </motion.div>
      </SectionContainer>
      
      {/* Bottom Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/5 blur-[150px] pointer-events-none" />
    </main>
  );
}
