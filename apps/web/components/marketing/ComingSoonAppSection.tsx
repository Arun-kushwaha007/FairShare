'use client';

import { motion } from 'framer-motion';
import { Smartphone, Sparkles, Zap, ShieldCheck, Bell, Camera, Fingerprint, ArrowRight } from 'lucide-react';
import { SectionContainer } from '../layout/SectionContainer';
import { AppStoreButtons } from './AppStoreButtons';
import { fadeUp, staggerContainer, scaleIn } from '../home/motion-variants';

const mobileFeatures = [
  { icon: Bell, text: 'Real-time notifications', color: 'text-blue-400' },
  { icon: Zap, text: 'Quick settle-up flows', color: 'text-amber-400' },
  { icon: Camera, text: 'Smart receipt scanning', color: 'text-purple-400' },
  { icon: Fingerprint, text: 'Biometric security', color: 'text-emerald-400' },
];

export function ComingSoonAppSection() {
  return (
    <SectionContainer id="mobile" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#030303]">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-indigo-600/5 blur-[100px]" />
      </div>

      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        {/* Left Content Side */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="eyebrow-label mb-6">
            <Smartphone size={14} className="text-purple-400" />
            <span>Mobile Experience</span>
          </motion.div>
          
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Take FairShare <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              wherever you go.
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeUp}
            className="mt-8 text-lg leading-relaxed text-zinc-400 max-w-xl"
          >
            Log expenses instantly at dinner, during trips, or at the grocery store. 
            The full power of FairShare, optimized for your pocket. Join the waitlist for exclusive early access.
          </motion.p>
          
          <motion.div
            variants={fadeUp}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {mobileFeatures.map((feature, idx) => (
              <div key={idx} className="group flex items-center gap-4 transition-colors">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] transition-all group-hover:border-purple-500/20 group-hover:bg-purple-500/10">
                  <feature.icon size={20} className={`${feature.color} opacity-80 group-hover:opacity-100`} />
                </div>
                <span className="text-sm font-semibold tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                  {feature.text}
                </span>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            variants={fadeUp}
            className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <div className="scale-95 origin-left opacity-80 filter grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <AppStoreButtons />
            </div>
            {/* <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 pr-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 font-bold text-xs">
                5K
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Waitlist</p>
                <p className="text-xs font-bold text-white">Users already registered</p>
              </div>
            </div> */}
          </motion.div>
        </motion.div>
        
        {/* Right Visual Side (iPhone Mockup) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative perspective-1000"
        >
          {/* Main Phone Frame */}
          <div className="relative mx-auto w-full max-w-[320px]">
            <div className="relative z-10 overflow-hidden rounded-[3.5rem] border-[8px] border-zinc-900 bg-black shadow-2xl ring-1 ring-white/10 ring-inset">
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#030303]" />
              
              {/* Screen Content */}
              <div className="aspect-[9/19.5] w-full bg-[#0a0a0a] p-4">
                {/* App Header */}
                <div className="flex items-center justify-between mb-8 mt-4">
                  <div className="h-2 w-12 rounded-full bg-white/10" />
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500" />
                </div>
                
                {/* Stat Summary */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 mb-6">
                  <div className="h-2 w-16 rounded-full bg-zinc-700 mb-2" />
                  <div className="h-6 w-32 rounded-lg bg-white/5" />
                </div>
                
                {/* Scrollable list mock */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.015] p-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-800" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 w-2/3 rounded-full bg-white/10" />
                        <div className="h-1.5 w-1/3 rounded-full bg-zinc-800" />
                      </div>
                      <div className="h-2 w-8 rounded-full bg-purple-500/20" />
                    </div>
                  ))}
                </div>
                
                {/* Bottom Bar */}
                <div className="absolute bottom-6 left-4 right-4 flex justify-around">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-white/5 border border-white/5" />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating UI Notification */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-16 z-20 hidden sm:flex w-64 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">System Notification</p>
                <p className="text-xs font-bold text-white">Expense verified by Sarah</p>
              </div>
            </motion.div>

            {/* Floating Bill Scan Visual */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 -left-20 z-20 hidden sm:flex w-56 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-400">RECEIPT SCAN</span>
                <Sparkles size={12} className="text-purple-400" />
              </div>
              <div className="h-24 w-full rounded-lg bg-zinc-800/50 border border-white/5 flex items-center justify-center">
                <Camera size={24} className="text-zinc-700" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-2 w-12 rounded-full bg-zinc-700" />
                <div className="h-4 w-12 rounded bg-purple-500/20" />
              </div>
            </motion.div>
          </div>

          {/* Ambient Glow behind phone */}
          <div className="absolute inset-x-0 top-1/2 -z-10 h-96 -translate-y-1/2 bg-purple-500/20 blur-[150px]" />
        </motion.div>
      </div>

      {/* Trust Quote / Stats */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-32 text-center"
      >
        {/* <p className="max-w-2xl mx-auto text-sm italic text-zinc-500">
          * Mobile app is currently in private beta for select users. 
          Early access keys are being sent weekly.
        </p> */}
      </motion.div>
    </SectionContainer>
  );
}
