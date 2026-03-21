'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Search, 
  Scan, 
  CheckCircle2, 
  Lock, 
  Unlock,
  AlertCircle,
  Command,
  Loader2,
  Terminal
} from 'lucide-react';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { GridBackground, FloatingOrb } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate system verification
    setTimeout(() => {
      setIsVerifying(false);
      setSubmitted(true);
    }, 2500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30">
      <GridBackground />
      
      {/* Floating Ambient Effects */}
      <FloatingOrb className="top-[10%] left-[5%] h-[400px] w-[400px] bg-purple-600/5 blur-[120px]" delay={0} />
      <FloatingOrb className="bottom-[10%] right-[5%] h-[500px] w-[500px] bg-indigo-600/5 blur-[150px]" delay={2} />

      <SectionContainer className="relative pt-44 text-center sm:pt-52">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-10">
            <div className="eyebrow-label bg-purple-500/5 text-purple-400 border-purple-500/20 px-6">
              <Scan size={12} className="text-purple-400/50" />
              <span>Identity Verification</span>
            </div>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7.5rem] leading-[0.8] uppercase mb-10"
          >
            THE <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">QUEUE.</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-[0.25em] text-zinc-500"
          >
            RESERVE YOUR SPOT IN THE NEXT GENERATION OF SHARING.
          </motion.p>
        </motion.div>
      </SectionContainer>

      <SectionContainer className="relative pb-48">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <GlassCard className="relative p-12 md:p-16 overflow-hidden">
                  {/* Decorative Scan Line */}
                  {!isVerifying && (
                    <motion.div 
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent z-0 pointer-events-none"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="mb-12 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-purple-500" />
                        <span>Access Point 01</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500/50" />
                      </div>
                    </div>

                    <h2 className="mb-8 text-3xl font-black uppercase italic tracking-tighter text-white">
                      IDENTITY <span className="text-purple-500">REQUIRED.</span>
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="group relative">
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="ASSIGNED NAME"
                          disabled={isVerifying}
                          className="w-full border border-white/5 bg-white/[0.02] px-8 py-6 rounded-2xl font-bold uppercase text-white placeholder-zinc-800 outline-none focus:border-purple-500/20 focus:bg-white/[0.05] transition-all text-xs tracking-[0.2em] group-hover:border-white/10"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-100">
                          <Search size={16} />
                        </div>
                      </div>

                      <div className="group relative">
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="COMMUNICATION CHANNEL"
                          disabled={isVerifying}
                          className="w-full border border-white/5 bg-white/[0.02] px-8 py-6 rounded-2xl font-bold uppercase text-white placeholder-zinc-800 outline-none focus:border-purple-500/20 focus:bg-white/[0.05] transition-all text-xs tracking-[0.2em] group-hover:border-white/10"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-100">
                          <AlertCircle size={16} />
                        </div>
                      </div>

                      <div className="pt-4">
                        <AccentButton 
                          type="submit"
                          disabled={isVerifying}
                          className="w-full h-18 text-xl"
                          variant="primary"
                        >
                          {isVerifying ? (
                            <span className="flex items-center gap-3">
                              VERIFYING... <Loader2 size={24} className="animate-spin" />
                            </span>
                          ) : (
                            <span className="flex items-center gap-3">
                              JOIN THE QUEUE <ArrowRight size={24} />
                            </span>
                          )}
                        </AccentButton>
                      </div>
                    </form>
                    
                    <div className="mt-10 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                      </div>
                      <div className="h-px w-8 bg-zinc-800" />
                      <div className="flex items-center gap-2">
                        <Zap size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Automated</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <GlassCard className="p-20 relative overflow-hidden ring-4 ring-emerald-500/20 bg-emerald-500/[0.02] border-emerald-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
                  
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="relative mx-auto mb-12 flex h-32 w-32 items-center justify-center rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-3xl shadow-emerald-500/20"
                  >
                    <CheckCircle2 size={64} strokeWidth={1.5} />
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 animate-ping rounded-[2.5rem] bg-emerald-500/20 opacity-20" />
                  </motion.div>

                  <h2 className="relative mb-6 text-6xl font-black uppercase italic tracking-tighter text-white">
                    LOCKED <span className="text-emerald-500">IN.</span>
                  </h2>
                  <p className="relative mb-12 text-lg font-bold uppercase tracking-widest text-zinc-500 leading-relaxed max-w-sm mx-auto">
                    VERIFICATION SIGNAL <br /> DISPATCHED TO YOUR INBOX.
                  </p>
                  
                  <AccentButton 
                    href="/"
                    variant="secondary"
                    className="h-16 px-12 text-lg"
                    icon={<ArrowRight size={20} />}
                  >
                    RETURN TO BASE
                  </AccentButton>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionContainer>
      
      {/* Bottom Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/5 blur-[150px] pointer-events-none" />
    </main>
  );
}
