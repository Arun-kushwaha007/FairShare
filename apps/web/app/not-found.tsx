'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionContainer } from '../components/layout/SectionContainer';
import { Rocket, MoveLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center overflow-hidden relative">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
      
      <SectionContainer className="text-center relative z-10">
        <div className="flex justify-center mb-12">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-purple-500/10 border border-purple-500/20 shadow-2xl"
          >
            <Rocket className="text-purple-500 fill-purple-500/20" size={48} />
          </motion.div>
        </div>

        <div className="relative">
          <h1 className="hero-title mb-6 text-8xl font-black italic tracking-tighter md:text-[12rem] leading-none uppercase text-white opacity-10 select-none">
            404
          </h1>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-8">
              LOST IN THE <br /> <span className="text-purple-600">SIMULATION.</span>
            </h2>
            <p className="mx-auto max-w-md text-sm md:text-lg font-bold uppercase tracking-widest text-zinc-500 mb-12">
              THE PAGE YOU&apos;RE LOOKING FOR HAS BEEN DE-RESSED. RETURN TO BASE.
            </p>
            
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-white/10"
            >
              <MoveLeft size={20} /> RETURN HOME
            </Link>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-32 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
          <span className="flex items-center gap-2">
            <AlertCircle size={14} /> STATUS: UNKNOWN_VOID
          </span>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <span>FREQ: 404.0 MHZ</span>
        </div>
      </SectionContainer>
    </main>
  );
}
