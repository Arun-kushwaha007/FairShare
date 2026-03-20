'use client';

import { motion } from 'framer-motion';
import { Zap, Users, RefreshCw, ShieldCheck, Layers, Activity, Sparkles, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { TiltCard } from '../../components/ui/TiltCard';

const featureList = [
  {
    title: 'Flexible split rules',
    description: 'Split equally, assign exact amounts, or use percentages for total control over group costs.',
    icon: Zap,
    eyebrow: 'Dynamic Logic',
    color: 'from-purple-500 to-indigo-500',
    className: 'md:col-span-8',
    stats: '15+ split modes',
  },
  {
    title: 'Dedicated group spaces',
    description: 'Separate contexts for roommates, trips, and teams.',
    icon: Users,
    eyebrow: 'Isolated',
    color: 'from-blue-500 to-cyan-500',
    className: 'md:col-span-4',
  },
  {
    title: 'Instant balance updates',
    description: 'Real-time synchronization across all devices instantly.',
    icon: RefreshCw,
    eyebrow: 'Real-time',
    color: 'from-emerald-500 to-teal-500',
    className: 'md:col-span-4',
  },
  {
    title: 'Receipt transparency',
    description: 'Attach supporting evidence so the group can confirm details without searching old message threads.',
    icon: ShieldCheck,
    eyebrow: 'Trust Layer',
    color: 'from-amber-500 to-orange-500',
    className: 'md:col-span-8',
    stats: 'Cloud Storage',
  },
  {
    title: 'Smart settlements',
    description: 'Algorithmically minimizes multiple debts into the fewest practical payments.',
    icon: Layers,
    eyebrow: 'Smart Math',
    color: 'from-rose-500 to-pink-500',
    className: 'md:col-span-6',
  },
  {
    title: 'Activity audit trail',
    description: 'Keep a comprehensive, searchable history of what changed and when group balances moved.',
    icon: Activity,
    eyebrow: 'Audit Trail',
    color: 'from-violet-500 to-purple-500',
    className: 'md:col-span-6',
  },
];

export function FeatureGrid() {
  return (
    <div className="py-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 gap-6 md:grid-cols-12"
      >
        {featureList.map((feature, i) => (
          <motion.div key={feature.title} variants={fadeUp} className={feature.className}>
            <TiltCard>
              <div className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04] lg:p-12">
                {/* Immersive Background Glow */}
                <div
                  className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${feature.color} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-10`}
                />

                {/* Grid Mesh Detail (Inherited from Hero) */}
                <div 
                  className="absolute inset-0 -z-10 opacity-[0.02]" 
                  style={{ 
                    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }} 
                />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-8 flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} p-2.5 text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                      >
                        <feature.icon size={24} />
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Sparkles size={10} className="text-white/20" />
                        {feature.eyebrow}
                      </div>
                    </div>

                    <h3 className="mb-4 text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
                      {feature.title}
                    </h3>

                    <p className="max-w-md text-base leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
                      {feature.description}
                    </p>
                  </div>

                  {/* High-Fidelity Stats Bar or Action Tag */}
                  <div className="mt-12 flex items-center justify-between">
                    {feature.stats ? (
                      <div className="flex items-center gap-4">
                        <div className="h-px w-8 bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-purple-400/60 transition-colors">
                          {feature.stats}
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}
                    
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Cinematic Glass Bottom Edge */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-20`} />
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
