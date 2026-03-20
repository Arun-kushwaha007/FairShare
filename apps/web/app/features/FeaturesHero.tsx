'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, ShieldCheck, Layers, MousePointer2 } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';

export function FeaturesHero() {
  return (
    <section className="relative overflow-hidden pt-2 pb-0 lg:pt-40 -mt-40 lg:-pb-20 -mb-40">
      {/* ── Background Infrastructure ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Deep Ambient Glows */}
        <div className="absolute left-1/2 top-0 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_70%)]" />
        <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[220px] animate-pulse" />
        <div className="absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[220px] animate-pulse [animation-delay:2s]" />

        {/* Dynamic Grid Mesh */}
        <div 
          className="absolute inset-0 opacity-[0.5]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
          }} 
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container relative mx-auto px-6 text-center"
      >
        {/* Floating 3D Elements - Decorative */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          >
            <Layers className="text-purple-400 opacity-40" size={24} />
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-10 bottom-1/4 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          >
            <Zap className="text-indigo-400 opacity-40" size={32} />
          </motion.div>

          <motion.div
            animate={{ 
              x: [0, 10, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/3 bottom-0"
          >
            <Sparkles className="text-purple-500" size={16} />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div variants={fadeUp} className="mb-10 flex justify-center">
            <div className="group relative flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-6 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-purple-400 transition-all hover:bg-purple-500/10 hover:border-purple-500/40">
              <Sparkles size={14} className="animate-spin-slow" />
              Comprehensive Platform
              <div className="absolute inset-0 -z-10 rounded-full bg-purple-500/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            Master your <br/>
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              group spending.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl md:text-2xl"
          >
            FairShare integrates enterprise-grade financial logic into a consumer interface. 
            Scale from weekend trips to lifelong roommate alliances.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-16 flex flex-wrap justify-center gap-6"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 backdrop-blur-md transition-colors hover:bg-white/[0.06]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Brain size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Intelligent</p>
                <p className="text-sm font-bold text-white">Smart Math</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 backdrop-blur-md transition-colors hover:bg-white/[0.06]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Zap size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Real-time</p>
                <p className="text-sm font-bold text-white">Instant Sync</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 backdrop-blur-md transition-colors hover:bg-white/[0.06]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Audited</p>
                <p className="text-sm font-bold text-white">Verified Splits</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll Indicator Overlay ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700">Explore Features</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1 w-px bg-gradient-to-b from-purple-500 to-transparent"
        />
      </motion.div>
    </section>
  );
}
