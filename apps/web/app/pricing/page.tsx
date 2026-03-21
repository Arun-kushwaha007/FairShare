'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Github, 
  Lock, 
  Unlock,
  AlertCircle,
  Command
} from 'lucide-react';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { GridBackground } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';

const features = [
  { id: 'groups', name: 'Unlimited Groups', tier: 'squad', description: 'Maximum utility for the squad.' },
  { id: 'splitting', name: 'Basic Splitting', tier: 'squad', description: 'Smooth, frictionless logic.' },
  { id: 'sync', name: 'Cloud Sync', tier: 'squad', description: 'Vibes stay current everywhere.' },
  { id: 'ai', name: 'AI Receipt Parsing', tier: 'pro', description: 'Machine learning goes brrr.' },
  { id: 'analytics', name: 'Advanced Analytics', tier: 'pro', description: 'Big numbers for big brains.' },
  { id: 'budget', name: 'Budget Insights', tier: 'pro', description: 'Know where the bread goes.' },
  { id: 'support', name: 'Priority Support', tier: 'pro', description: 'Direct line to the devs.' },
];

export default function PricingPage() {
  const [isPro, setIsPro] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runOverride = () => {
    setIsOverriding(true);
    const mockLogs = [
      '> Initializing system override...',
      '> Bypassing subscription gatekeeper...',
      '> Injecting open-source credentials...',
      '> Accessing Main Character privileges...',
      '> Success: Pro features unlocked for $0.',
    ];

    mockLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === mockLogs.length - 1) {
          setTimeout(() => {
            setIsPro(true);
            setIsOverriding(false);
          }, 800);
        }
      }, index * 400);
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30">
      {/* ── Background Infrastructure ── */}
      <GridBackground />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
      
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[150px]" />

      <SectionContainer className="relative pt-44 lg:pt-52">
        <div className="mx-auto max-w-5xl">
          {/* Header Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-20 text-center lg:text-left"
          >
            <motion.div variants={fadeUp} className="mb-6 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                <Command size={12} />
                <span>System Configuration</span>
              </div>
            </motion.div>
            
            <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <motion.div variants={fadeUp}>
                <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
                  NO <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">CAP.</span> <br />
                  NO CHARGE.
                </h1>
                <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-zinc-500">
                  We aren&apos;t here to gatekeep. FairShare is open source, which means the "Pro" experience is yours for the taking.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 lg:items-end">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Current Status</p>
                  <div className={`flex items-center gap-2 text-xl font-black italic tracking-tighter ${isPro ? 'text-purple-400' : 'text-zinc-500'}`}>
                    {isPro ? (
                      <>
                        <Unlock size={20} className="text-purple-500" />
                        MAIN CHARACTER
                      </>
                    ) : (
                      <>
                        <Lock size={20} className="text-zinc-700" />
                        SQUAD MEMBER
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Unique Interface Section ── */}
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Feature Access Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8 lg:p-12"
            >
              <div className="mb-10 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Feature Matrix</h2>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500/20" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
                  <div className="h-2 w-2 rounded-full bg-green-500/20" />
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group relative flex items-center justify-between rounded-2xl border p-5 transition-all ${
                      feature.tier === 'pro' && !isPro 
                        ? 'border-white/5 bg-transparent opacity-40' 
                        : 'border-white/10 bg-white/[0.03] shadow-lg shadow-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${
                        feature.tier === 'pro' && isPro ? 'text-purple-400' : 'text-zinc-600'
                      }`}>
                        {feature.tier === 'pro' && !isPro ? <Lock size={16} /> : <Check size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{feature.name}</p>
                        <p className="text-xs text-zinc-500">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {feature.tier === 'pro' && !isPro ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Locked</span>
                      ) : (
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          feature.tier === 'pro' ? 'text-purple-500' : 'text-emerald-500'
                        }`}>
                          {feature.tier === 'pro' ? 'Activated' : 'Free'}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Internal decorative lines */}
              <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            </motion.div>

            {/* Interaction / Terminal Panel */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950 p-8 shadow-3xl"
              >
                <div className="mb-6 flex items-center gap-2 text-zinc-500">
                  <Terminal size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pricing Terminal</span>
                </div>

                <div className="mb-10 min-h-[160px] space-y-2 font-mono text-[11px] leading-relaxed text-purple-400/70">
                  {!isOverriding && !isPro && (
                    <p className="text-zinc-600 italic">Waiting for command...</p>
                  )}
                  {logs.map((log, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={i === logs.length - 1 ? 'text-emerald-400 font-bold' : ''}
                    >
                      {log}
                    </motion.p>
                  ))}
                  {isPro && !isOverriding && (
                    <p className="text-emerald-500 font-bold mt-4">System operating in Main Character mode.</p>
                  )}
                </div>

                {!isPro ? (
                  <button
                    onClick={runOverride}
                    disabled={isOverriding}
                    className="group relative w-full overflow-hidden rounded-2xl bg-purple-600 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-purple-500 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isOverriding ? 'Overriding...' : 'Override to Pro'}
                      <Zap size={16} className="fill-white" />
                    </span>
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 opacity-0 transition-opacity group-hover:opacity-100 animate-shimmer" />
                  </button>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                    <p className="text-sm font-bold text-emerald-400">Main Character Enabled</p>
                    <p className="mt-2 text-[10px] uppercase tracking-widest text-emerald-500/60 font-black">Cost: $0.00 Forever</p>
                  </div>
                )}
                
                <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                  No credit card required. Ever.
                </p>
              </motion.div>

              {/* Contributor Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-white">
                    <Github size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Open Source W</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Found a bug? Help us fix it.</p>
                  </div>
                </div>
                <a 
                  href="https://github.com" 
                  className="mt-6 flex items-center justify-between group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">View Source</span>
                  <ArrowRight size={14} className="text-zinc-600 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </div>
          </div>
          
          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-32 border-t border-white/5 pt-16 text-center"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 mb-8">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-xl font-bold mb-4">Wait, for real?</h3>
            <p className="mx-auto max-w-xl text-zinc-500 leading-relaxed">
              Yes. We believe group finance tools should be open and accessible. 
              The "Pro" features are built by the community, for the community.
            </p>
          </motion.div>
        </div>
      </SectionContainer>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">Community Supported</p>
          <div className="h-1 w-px bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}
