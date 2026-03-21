'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Users, 
  Receipt, 
  PieChart, 
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Command,
  Zap
} from 'lucide-react';
import { GridBackground } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';

const steps = [
  {
    step: 1,
    title: 'Initialize Group',
    description: 'Establish a new financial node for your trip, shared household, or social event. Define the base parameters and naming convention.',
    icon: Plus,
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    step: 2,
    title: 'Sync Participants',
    description: 'Onboard your core team via secure invite links. Participants are instantly synchronized across the distributed ledger.',
    icon: Users,
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    step: 3,
    title: 'Log Operations',
    description: 'Record real-time expenses as they occur. Our engine handles multi-currency processing and receipt digitization effortlessly.',
    icon: Receipt,
    color: 'from-orange-500/20 to-yellow-500/20'
  },
  {
    step: 4,
    title: 'Automated Reconciliation',
    description: 'The FairShare algorithm calculates exact debt positions in real-time, eliminating manual computation and human error.',
    icon: PieChart,
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    step: 5,
    title: 'Final Settlement',
    description: 'Execute one-tap clearings to neutralize all outstanding balances. All participants receive verified settlement notifications.',
    icon: CheckCircle,
    color: 'from-indigo-500/20 to-purple-500/20'
  },
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30 font-sans">
      {/* ── Background Infrastructure ── */}
      <GridBackground />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute top-[0%] left-1/2 -translate-x-1/2 h-[500px] w-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05),transparent_70%)] blur-[80px]" />
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] bg-indigo-600/5 blur-[180px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                <Command size={12} />
                <span>Operational Protocol</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-6xl font-black tracking-tighter md:text-8xl lg:text-[7.5rem] leading-[0.85] text-white mb-10"
            >
              NO STRESS. <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">NO MANUAL MATH.</span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-500 leading-relaxed font-medium"
            >
              The FairShare engine utilizes a precise five-step sequence to ensure absolute financial clarity across any group architecture.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Steps Flow */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto relative">
          {/* Central Line */}
          <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-white/5 to-transparent hidden md:block" />
          
          <div className="space-y-32">
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`relative flex flex-col md:flex-row items-center gap-12 ${
                  idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Number Indicator */}
                <div className="absolute left-[-10px] md:left-1/2 md:-translate-x-1/2 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-white/10 bg-[#030303] z-20 shadow-2xl group">
                  <span className="text-3xl font-black text-white italic">{step.step}</span>
                  <div className="absolute inset-0 rounded-[2rem] bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>

                {/* Content Card */}
                <div className="relative w-full md:w-[45%]">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                  <GlassCard className="relative p-10 md:p-12 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group overflow-hidden">
                    {/* Internal Decorative Line */}
                    <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                    
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-8 border border-white/5 shadow-inner`}>
                      <step.icon size={26} className="text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-black italic tracking-tighter text-white mb-4">{step.title}</h3>
                    <p className="text-base text-zinc-500 font-medium leading-relaxed">
                      {step.description}
                    </p>

                    <div className="mt-8 flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-purple-500/20" />
                      <div className="h-1 w-2 rounded-full bg-purple-500/10" />
                    </div>
                  </GlassCard>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-48 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-16 md:p-32 text-center overflow-hidden shadow-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <motion.div variants={fadeUp} className="mb-10 flex justify-center">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/20">
                <Zap size={32} className="fill-purple-400" />
              </div>
            </motion.div>

            <h2 className="relative text-5xl md:text-8xl font-black tracking-tighter italic text-white mb-10 leading-[0.9]">
              STOP THE <br />
              <span className="text-zinc-700">STRESS.</span>
            </h2>
            <p className="relative mx-auto max-w-xl text-lg md:text-xl text-zinc-500 mb-14 font-medium leading-relaxed">
              Join the new standard of group financial management. No more guesswork, just pure mathematical harmony.
            </p>
            
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register" className="w-full sm:w-auto">
                <AccentButton className="h-18 px-12 text-lg font-black uppercase tracking-widest w-full" variant="primary">
                  Start Splitting Now
                </AccentButton>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="h-18 px-12 rounded-2xl border border-white/10 bg-white/5 text-lg font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3 w-full">
                  Sign In <ChevronRight size={22} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-24 text-center border-t border-white/5 bg-[#010101]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-zinc-800">
            <div className="h-0.5 w-12 bg-current" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">
              Operational Protocol v1.0.4
            </p>
            <div className="h-0.5 w-12 bg-current" />
          </div>
          <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-2">
            © 2024 FairShare Technologies Inc. All nodes secured.
          </p>
        </div>
      </footer>
    </main>
  );
}
