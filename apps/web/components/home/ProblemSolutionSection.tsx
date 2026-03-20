'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, XCircle, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { SectionContainer } from '../layout/SectionContainer';
import { staggerContainer, fadeUp, scaleIn } from './motion-variants';

const comparisons = [
  {
    problem: 'Expenses get logged late, leading to balance drift.',
    solution: 'Real-time sync keeps everyone aligned instantly.',
    icon: Zap,
  },
  {
    problem: 'Lost receipts cause arguments over price details.',
    solution: 'Digital snapshots stay attached to every record.',
    icon: Shield,
  },
  {
    problem: 'Complex settle-up math adds unnecessary friction.',
    solution: 'Optimized algorithms minimize the number of transfers.',
    icon: Sparkles,
  },
];

export function ProblemSolutionSection() {
  return (
    <SectionContainer size="compact" className="relative overflow-hidden -mt-32">
      {/* Background Grid Accent */}
      <div className="pointer-events-none absolute inset-0 -top-20 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
      </div>

      <div className="relative">
        {/* Header Area */}
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow-label mb-6 bg-red-500/5 text-red-400 border-red-500/20"
          >
            The Friction vs The Solution
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Stop the headache of{' '}
            <span className="text-red-500/80">manual tracking.</span>
          </motion.h2>
        </div>

        {/* Comparison Layout */}
        <div className="relative mx-auto max-w-5xl">
          {/* Central Connector Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-red-500/20 via-purple-500/20 to-emerald-500/20 md:block">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-red-500 via-purple-500 to-emerald-500"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-12 md:space-y-24"
          >
            {comparisons.map((item, i) => (
              <div key={i} className="relative grid items-center gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
                {/* Problem Side */}
                <motion.div
                  variants={fadeUp}
                  className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] md:text-right"
                >
                  <div className="mb-4 flex items-center gap-3 md:flex-row-reverse">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                      <XCircle size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-red-500/60">Outdated</span>
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-zinc-400 group-hover:text-zinc-300">
                    {item.problem}
                  </p>

                  {/* 3D Decorative Shape (Problem Side) */}
                  <div className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 rounded-xl border border-red-500/20 bg-red-500/5 blur-sm transition-transform group-hover:scale-110" />
                </motion.div>

                {/* Solution Side */}
                <motion.div
                  variants={fadeUp}
                  className="group relative rounded-3xl border border-purple-500/20 bg-purple-500/[0.04] p-8 transition-all hover:bg-purple-500/[0.08] hover:border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.05)]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                      <item.icon size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">FairShare</span>
                  </div>
                  <p className="text-lg font-bold leading-relaxed text-white">
                    {item.solution}
                  </p>

                  {/* 3D Decorative Shape (Solution Side) */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 border border-purple-500/30 bg-purple-500/5 blur-md"
                    style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                  />
                  
                  {/* Subtle Interaction Arrow */}
                  <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <CheckCircle2 size={16} className="text-purple-400" />
                  </div>
                </motion.div>
                
                {/* Center Badge (Desktop Only) */}
                <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center md:flex">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#030303] shadow-xl"
                  >
                    <ArrowRight size={14} className="text-zinc-500 group-hover:text-white" />
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Final Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-600">
            Efficiency realized
          </p>
        </motion.div>
      </div>
    </SectionContainer>
  );
}
