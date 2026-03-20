'use client';

import { ShieldCheck, Lock, EyeOff, Server, HardDrive, Key, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionContainer } from '../layout/SectionContainer';

const securityFeatures = [
  { label: 'Cloud Security', value: 'SOC 2 Type II', icon: Server },
  { label: 'Data at Rest', value: 'AES-256 Bit', icon: HardDrive },
  { label: 'Access Control', value: 'Multi-Factor', icon: Key },
  { label: 'Privacy First', value: 'No Data Sales', icon: Fingerprint },
];

export function SecurityStripSection() {
  return (
    <SectionContainer size="compact" className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="group relative overflow-hidden rounded-[3rem] border border-emerald-500/10 bg-emerald-500/[0.02] p-8 sm:p-12 lg:p-16"
      >
        {/* Animated Scanning Beam */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent skew-x-12 opacity-0 transition-opacity group-hover:opacity-100"
        />

        <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center">
          {/* Main Info */}
          <div className="flex-1">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShieldCheck size={32} />
              </motion.div>
            </div>
            
            <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your data is a <span className="text-emerald-400">fortress.</span>
            </h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
              We employ bank-level encryption and rigorous security protocols to ensure your financial 
              privacy is never compromised. Zero-knowledge architecture means even we can't see your data.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-1.5">
                <Lock size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-1.5">
                <EyeOff size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Private by Design</span>
              </div>
            </div>
          </div>

          {/* Stats/Features Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:w-1/3 shrink-0">
            {securityFeatures.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
              >
                <item.icon size={18} className="mb-4 text-emerald-500/60" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{item.label}</p>
                <p className="text-sm font-bold text-white">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-[100px] transition-opacity group-hover:opacity-20" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/5 blur-[100px] transition-opacity group-hover:opacity-20" />
      </motion.div>
    </SectionContainer>
  );
}
