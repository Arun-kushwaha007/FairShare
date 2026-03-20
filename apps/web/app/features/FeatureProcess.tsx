'use client';

import { motion } from 'framer-motion';
import { ReceiptText, RefreshCw, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';

const steps = [
  {
    title: 'Capture clearly',
    description: 'Add the amount, choose the split method, and attach receipts instantly.',
    icon: ReceiptText,
    label: 'Identify',
    color: 'text-purple-400',
    glow: 'bg-purple-500/20',
  },
  {
    title: 'Stay in sync',
    description: 'Balances update for the entire group the moment an expense is saved.',
    icon: RefreshCw,
    label: 'Synchronize',
    color: 'text-indigo-400',
    glow: 'bg-indigo-500/20',
  },
  {
    title: 'Close the loop',
    description: 'Turn a complex web of debts into a single set of simple settlements.',
    icon: Layers,
    label: 'Settle',
    color: 'text-emerald-400',
    glow: 'bg-emerald-500/20',
  },
];

export function FeatureProcess() {
  return (
    <div className="relative py-4 -mt-40">
      {/* Background Decorative Mesh - Inherited from Hero */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.03),transparent_70%)] opacity-40" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-12 lg:grid-cols-3"
      >
        {steps.map((step, i) => (
          <motion.div key={step.title} variants={fadeUp} className="group relative rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-10 transition-all hover:bg-white/[0.04]">
            {/* Step Connector Label */}
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-black text-white shadow-xl transition-transform group-hover:scale-110">
                0{i + 1}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 group-hover:text-purple-400 transition-colors">
                  {step.label}
                </span>
                <Sparkles size={8} className="text-zinc-800" />
              </div>
            </div>

            {/* Visual Indicator with 3D Depth */}
            <div className="relative mb-12 inline-block">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white/[0.06] group-hover:shadow-purple-500/10">
                <step.icon size={36} className={`relative z-10 ${step.color} transition-colors group-hover:text-white`} />
                
                {/* Internal Glow */}
                <div className={`absolute inset-4 -z-10 rounded-3xl ${step.glow} blur-2xl opacity-40 transition-opacity group-hover:opacity-100`} />
              </div>
              
              {/* Outer Orbit Ring */}
              <div className="absolute -inset-4 rounded-[2.5rem] border border-white/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </div>

            <h3 className="text-2xl font-extrabold tracking-tight text-white mb-4">
              {step.title}
            </h3>
            
            <p className="text-base leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
              {step.description}
            </p>

            {/* Horizontal Connection Arrow (Desktop) */}
            {i < 2 && (
              <div className="absolute -right-6 top-32 hidden lg:block">
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-white/5 group-hover:text-white/20 transition-colors"
                >
                  <ArrowRight size={24} />
                </motion.div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
