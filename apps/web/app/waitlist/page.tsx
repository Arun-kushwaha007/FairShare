'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { CheckCircle2, MoveRight } from 'lucide-react';

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            Reserved Access
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          THE <br className="md:hidden" /> <span className="text-purple-600">QUEUE.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          RESERVE YOUR SPOT IN THE NEXT GENERATION OF SHARING.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-48">
        <div className="mx-auto max-w-2xl">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="glass-panel p-12 md:p-16 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
              <h2 className="relative mb-6 text-3xl font-black uppercase italic tracking-tighter text-white">
                GET EARLY ACCESS.
              </h2>
              <p className="relative mb-10 font-bold uppercase tracking-widest text-zinc-500 text-sm">
                PRO FEATURES AND BETA SLOTS ARE LIMITED. <br className="hidden md:block" /> DON'T GET LEFT BEHIND IN THE SIMULATION.
              </p>
              
              <form onSubmit={handleSubmit} className="relative space-y-6">
                <input
                  required
                  type="text"
                  placeholder="IDENTITY"
                  className="w-full border border-white/10 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase text-white placeholder-zinc-800 outline-none focus:bg-white/10 transition-all text-sm tracking-widest"
                />
                <input
                  required
                  type="email"
                  placeholder="FREQUENCY"
                  className="w-full border border-white/10 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase text-white placeholder-zinc-800 outline-none focus:bg-white/10 transition-all text-sm tracking-widest"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-6 bg-purple-600 text-white text-xl font-black italic tracking-tighter uppercase rounded-2xl shadow-2xl shadow-purple-900/40 hover:scale-[1.02] transition-all"
                >
                  JOIN QUEUE <MoveRight size={24} />
                </button>
              </form>
              
              <p className="relative mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                DATA IS ENCRYPTED. NO SPAM PROTOCOL ACTIVE.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-20 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
              <div className="relative mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-500 shadow-2xl backdrop-blur-3xl">
                <CheckCircle2 size={48} strokeWidth={2} />
              </div>
              <h2 className="relative mb-4 text-5xl font-black uppercase italic tracking-tighter text-white">
                LOCKED <span className="text-purple-500">IN.</span>
              </h2>
              <p className="relative mb-12 text-lg font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
                WE HAVE DISPATCHED A VERIFICATION <br /> SIGNAL TO YOUR INBOX.
              </p>
              <a
                href="/"
                className="relative inline-block px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-white/10"
              >
                RETURN TO BASE
              </a>
            </motion.div>
          )}
        </div>
      </SectionContainer>
    </main>
  );
}
