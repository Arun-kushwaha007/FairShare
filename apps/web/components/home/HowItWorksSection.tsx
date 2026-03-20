'use client';

import { motion } from 'framer-motion';
import { UserPlus, Receipt, CreditCard, ArrowRight, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { SectionContainer } from '../layout/SectionContainer';
import { TiltCard } from '../ui/TiltCard';
import { staggerContainer, fadeUp } from './motion-variants';

const steps = [
  {
    number: '01',
    title: 'Create Your Group',
    description: 'Invite roommates, friends, or travel partners in seconds with a simple join link.',
    icon: UserPlus,
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
    glow: 'shadow-purple-500/10',
  },
  {
    number: '02',
    title: 'Log Shared Bills',
    description: 'Snap receipts or enter amounts. We handle the currency and custom split math automatically.',
    icon: Receipt,
    color: 'from-violet-500/20 to-indigo-500/20',
    iconColor: 'text-violet-400',
    glow: 'shadow-violet-500/10',
  },
  {
    number: '03',
    title: 'Settle Instantly',
    description: 'See live balances and clear debts with one click. Clear summaries for total peace of mind.',
    icon: CreditCard,
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400',
    glow: 'shadow-indigo-500/10',
  },
];

export function HowItWorksSection() {
  return (
    <SectionContainer size="compact" className="relative">
      {/* Background Heading Accent */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none opacity-[0.02]">
        <h2 className="text-[12rem] font-black uppercase leading-none text-white whitespace-nowrap">Process</h2>
      </div>

      <div className="relative mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 mb-6"
        >
          <Zap size={14} className="text-purple-400 fill-purple-400/20" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">The Workflow</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Simple as <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">1-2-3.</span>
        </motion.h2>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="relative grid gap-8 lg:grid-cols-3 lg:gap-12"
      >
        {/* Connection Path (behind cards) */}
        <div className="absolute top-1/2 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent lg:block">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-violet-500/40 to-indigo-500/40"
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>

        {steps.map((step, i) => (
          <motion.div key={i} variants={fadeUp} className="relative">
            <TiltCard>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:shadow-[0_0_60px_-15px_rgba(168,85,247,0.15)]">
                {/* Step Number Badge */}
                <div className="mb-8 flex items-end justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} border border-white/5`}>
                    <step.icon size={22} className={step.iconColor} />
                  </div>
                  <span className="text-5xl font-black italic tracking-tighter text-white/5 transition-colors group-hover:text-white/10">
                    {step.number}
                  </span>
                </div>

                <div className="relative">
                  <h3 className="mb-4 text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {step.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="mt-8 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">Fast Forward</span>
                  <ArrowRight size={12} className="text-purple-500" />
                </div>

                {/* Background Accent Gradient */}
                <div className={`absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors`} />
              </div>
            </TiltCard>
            
            {/* Step Connector (Mobile only indicator) */}
            {i < steps.length - 1 && (
              <div className="flex justify-center p-4 lg:hidden">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight size={24} className="rotate-90 text-zinc-800" />
                </motion.div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Stats/Trust Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-white/5 bg-white/[0.01] p-6 lg:p-8"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-emerald-400" />
          <span className="text-sm text-zinc-400 italic">"Simplest group finances I've used."</span>
        </div>
        <div className="h-px w-12 bg-white/10 hidden sm:block" />
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="h-6 w-6 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-zinc-500">Trusted by 5k+ groups</span>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
