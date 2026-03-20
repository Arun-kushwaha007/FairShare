'use client';

import { motion } from 'framer-motion';
import { Plane, Home, Briefcase, Trophy, Sparkles, Building2 } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';

const cases = [
  { icon: Plane, title: 'For trips', desc: 'Track meals, rides, and shared bookings on the go.' },
  { icon: Home, title: 'For roommates', desc: 'Manage rent, groceries, and shared household bills.' },
  { icon: Briefcase, title: 'For teams', desc: 'Professional expense records for reimbursements.' },
  { icon: Building2, title: 'For clubs', desc: 'Track dues and shared event budgets clearly.' }
];

export function FeatureUseCases() {
  return (
    <div className="relative py-4 -mt-40">
      {/* Background Decorative Icons - Multi-Layered */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.03]">
        <Trophy size={400} className="absolute -left-20 top-0 text-white rotate-12" />
        <Plane size={300} className="absolute -right-20 bottom-0 text-white -rotate-12" />
      </div>

      <GlassCard className="overflow-hidden border-white/5 bg-black/40 shadow-[0_0_120px_rgba(0,0,0,0.6)]">
        <div className="grid gap-16 p-8 sm:p-12 lg:p-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2 text-[0.6rem] font-black uppercase tracking-[0.3em] text-indigo-400">
                <Sparkles size={12} />
                Versatility
              </div>
            </motion.div>
            
            <motion.h2 
              variants={fadeUp}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              One app for every <br/>
              <span className="text-purple-400">group dynamic.</span>
            </motion.h2>
            
            <motion.p 
              variants={fadeUp}
              className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-500 sm:text-xl"
            >
              Designed to scale from weekend getaways to professional organizational management.
            </motion.p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cases.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/[0.01] p-8 text-center transition-all duration-500 hover:border-purple-500/20 hover:bg-white/[0.04] lg:items-start lg:text-left"
              >
                {/* 3D Icon Container */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.03] text-zinc-500 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:text-purple-400">
                  <item.icon size={28} />
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-purple-100">
                  {item.title}
                </h3>
                
                <p className="text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
                  {item.desc}
                </p>

                {/* Perspective Detail */}
                <div className="absolute top-4 right-4 text-white/5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Sparkles size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
