'use client';

import { ArrowRight, ReceiptText, RefreshCw, ShieldCheck, GitMerge, Zap, Users, BarChart3, BellRing, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionContainer } from '../layout/SectionContainer';
import { staggerContainer, fadeUp } from './motion-variants';

const features = [
  {
    title: 'Unified Ledger',
    description: 'Add bills, assign who owes what, and keep the group ledger current without bouncing between messages.',
    icon: ReceiptText,
    size: 'large',
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
  },
  {
    title: 'Live Sync',
    description: 'Everyone stays aligned as new expenses land, reducing backtracking.',
    icon: RefreshCw,
    size: 'small',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    title: 'Optimization',
    description: 'FairShare reduces a messy web of debts into clear, minimal settle-up actions.',
    icon: GitMerge,
    size: 'small',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Secure Verification',
    description: 'Keep proof attached to the expense so the group can verify details instantly without digging through gallery screenshots.',
    icon: ShieldCheck,
    size: 'large',
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
  },
];

export function FeatureGridSection() {
  return (
    <SectionContainer id="features" className="relative">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 bg-purple-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 bg-blue-600/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-16"
      >
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 mb-6"
          >
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">The Powerhouse</span>
          </motion.div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Everything you need,<br />
            <span className="text-white/40">nothing you don&apos;t.</span>
          </h2>
        </div>
        <Link
          href="/features"
          className="group flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-purple-400"
        >
          Explore Full Feature Set
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:border-purple-500/40 group-hover:bg-purple-500/10">
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6"
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            className={`group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] lg:p-10 ${
              feature.size === 'large' ? 'md:col-span-3 lg:col-span-7' : 'md:col-span-3 lg:col-span-5'
            }`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${feature.color} border border-white/10 shadow-lg shadow-black/20 transition-transform group-hover:-rotate-6 group-hover:scale-110`}>
                  <feature.icon size={28} className={feature.iconColor} />
                </div>
                <h3 className="mb-4 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-purple-300">
                  {feature.title}
                </h3>
                <p className="max-w-md text-base leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-300">
                  {feature.description}
                </p>
              </div>

              {feature.size === 'large' && (
                <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                  {[
                    { label: 'Uptime', val: '99.9%' },
                    { label: 'Sync', val: '< 50ms' },
                    { label: 'Cloud', val: 'E2EE' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{stat.label}</p>
                      <p className="text-sm font-bold text-white">{stat.val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Background Illustration Accent (Abstract Circles) */}
            <div className={`absolute -right-8 -top-8 h-48 w-48 rounded-full bg-gradient-to-br ${feature.color} opacity-[0.03] blur-3xl transition-opacity group-hover:opacity-[0.08]`} />
          </motion.div>
        ))}

        {/* Floating Mini Feature Row */}
        <motion.div
          variants={fadeUp}
          className="md:col-span-6 lg:col-span-12 flex flex-wrap gap-4 mt-4"
        >
          {[
            { icon: Users, label: 'Unlimited Groups' },
            { icon: BarChart3, label: 'Expense Stats' },
            { icon: BellRing, label: 'Instant Alerts' },
            { icon: Zap, label: 'Auto Split' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.01] px-5 py-3 transition-colors hover:bg-white/[0.03] hover:border-white/10">
              <item.icon size={16} className="text-zinc-500" />
              <span className="text-xs font-bold text-zinc-400">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
