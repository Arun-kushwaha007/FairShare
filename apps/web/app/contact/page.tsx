'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Twitter, 
  Instagram, 
  Github, 
  Send, 
  User, 
  AtSign, 
  AlignLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Command,
  ArrowRight
} from 'lucide-react';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { GridBackground, FloatingOrb } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';
import { sendContactAction } from '../actions/contact';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('message', form.message);

    try {
      const result = await sendContactAction(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Signal lost. Please try again.');
      }
    } catch (err) {
      setError('Transmission Protocol Error. Check your connection.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30">
      <GridBackground />
      
      {/* Floating Ambient Effects */}
      <FloatingOrb className="top-[10%] right-[15%] h-[400px] w-[400px] bg-purple-600/5 blur-[120px]" delay={0} />
      <FloatingOrb className="bottom-[15%] left-[10%] h-[500px] w-[500px] bg-indigo-600/5 blur-[150px]" delay={2} />

      <SectionContainer className="relative pt-44 text-center sm:pt-52">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-10">
            <div className="eyebrow-label bg-purple-500/5 text-purple-400 border-purple-500/20 px-6">
              <Zap size={12} className="text-purple-400/50" />
              <span>Support Protocol</span>
            </div>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7.5rem] leading-[0.8] uppercase mb-10"
          >
            CON <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">NECT.</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-[0.25em] text-zinc-500"
          >
            DIRECT CHANNELS TO THE FAIRSHARE CORE SQUAD.
          </motion.p>
        </motion.div>
      </SectionContainer>

      <SectionContainer className="relative pb-48">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* Channels Info */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={fadeUp}>
              <h2 className="mb-6 text-4xl font-black uppercase italic tracking-tighter text-white">
                HIT US <span className="text-purple-500">UP.</span>
              </h2>
              <p className="max-w-md text-lg font-bold uppercase tracking-[0.1em] text-zinc-500 leading-relaxed">
                WHETHER YOU HAVE A BUG REPORT, A FEATURE REQUEST, OR JUST WANT TO SAY HI, OUR SQUAD IS STANDING BY.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-6">
              <a
                href="mailto:fairshare4u@gmail.com"
                className="group relative block"
              >
                <GlassCard className="flex items-center gap-8 p-8 transition-all hover:bg-white/[0.03] border-white/5 hover:border-purple-500/20">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Mail size={28} className="text-purple-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">EMAIL PROTOCOL</div>
                    <div className="text-xl font-black italic tracking-tight text-white uppercase group-hover:text-purple-400 transition-colors">FAIRSHARE4U@GMAIL.COM</div>
                  </div>
                </GlassCard>
              </a>

              <div className="opacity-40 grayscale pointer-events-none">
                <GlassCard className="flex items-center gap-8 p-8 border-white/5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/5">
                    <MessageSquare size={28} className="text-zinc-800" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 mb-1">LIVE DISPATCH</div>
                    <div className="text-xl font-black italic tracking-tight text-zinc-700 uppercase">COMING SOON</div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-4">
              {[
                { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com/fairshare' },
                { Icon: Github, label: 'Github', href: 'https://github.com/Arun-kushwaha007/FairShare' },
                { Icon: Instagram, label: 'Instagram', href: '#' }
              ].map(({ Icon, label, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 hover:text-purple-400 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact Node Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                >
                  <GlassCard className="relative p-10 md:p-14 overflow-hidden border-white/5 shadow-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="mb-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                        <div className="flex items-center gap-2">
                          <Command size={14} className="text-purple-500" />
                          <span>Signal Node Alpha</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="h-1 w-4 rounded-full bg-purple-500/20" />
                          <div className="h-1 w-2 rounded-full bg-purple-500/50" />
                        </div>
                      </div>

                      <h2 className="mb-10 text-3xl font-black uppercase italic tracking-tighter text-white">
                        DISPATCH <span className="text-purple-500">SIGNAL.</span>
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-bold text-red-500"
                          >
                            <AlertCircle size={14} />
                            <span>{error}</span>
                          </motion.div>
                        )}

                        <div className="group relative">
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[.3em] text-zinc-600 ml-1">Identity</label>
                          <div className="relative">
                            <input
                              required
                              type="text"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              placeholder="YOUR NAME"
                              disabled={isSending}
                              className="w-full border border-white/5 bg-white/[0.02] px-7 py-5 rounded-xl font-bold uppercase text-white placeholder-zinc-800 outline-none focus:border-purple-500/20 focus:bg-white/[0.05] transition-all text-xs tracking-[0.2em]"
                            />
                            <User size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-purple-500 transition-colors" />
                          </div>
                        </div>

                        <div className="group relative">
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[.3em] text-zinc-600 ml-1">Frequency</label>
                          <div className="relative">
                            <input
                              required
                              type="email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              placeholder="EMAIL CHANNEL"
                              disabled={isSending}
                              className="w-full border border-white/5 bg-white/[0.02] px-7 py-5 rounded-xl font-bold uppercase text-white placeholder-zinc-800 outline-none focus:border-purple-500/20 focus:bg-white/[0.05] transition-all text-xs tracking-[0.2em]"
                            />
                            <AtSign size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-purple-500 transition-colors" />
                          </div>
                        </div>

                        <div className="group relative">
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[.3em] text-zinc-600 ml-1">Content</label>
                          <div className="relative">
                            <textarea
                              required
                              rows={4}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              placeholder="YOUR MESSAGE..."
                              disabled={isSending}
                              className="w-full border border-white/5 bg-white/[0.02] px-7 py-5 rounded-xl font-bold uppercase text-white placeholder-zinc-800 outline-none focus:border-purple-500/20 focus:bg-white/[0.05] transition-all text-xs tracking-[0.2em] resize-none"
                            />
                            <AlignLeft size={14} className="absolute right-6 top-6 text-zinc-800 group-focus-within:text-purple-500 transition-colors" />
                          </div>
                        </div>

                        <div className="pt-4">
                          <AccentButton 
                            type="submit"
                            disabled={isSending}
                            className="w-full h-18 text-xl"
                            variant="primary"
                          >
                            {isSending ? (
                              <span className="flex items-center gap-3">
                                TRANSMITTING... <Loader2 size={24} className="animate-spin" />
                              </span>
                            ) : (
                              <span className="flex items-center gap-3">
                                SEND SIGNAL <Send size={24} />
                              </span>
                            )}
                          </AccentButton>
                        </div>
                      </form>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  key="success-node"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <GlassCard className="p-20 relative overflow-hidden border-purple-500/20 bg-purple-500/[0.02]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_70%)] pointer-events-none" />
                    
                    <motion.div 
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="relative mx-auto mb-12 flex h-32 w-32 items-center justify-center rounded-[2.5rem] border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-3xl shadow-purple-500/20"
                    >
                      <CheckCircle2 size={64} strokeWidth={1.5} />
                      <div className="absolute inset-0 animate-pulse rounded-[2.5rem] bg-purple-500/20 opacity-20" />
                    </motion.div>

                    <h2 className="relative mb-6 text-6xl font-black uppercase italic tracking-tighter text-white">
                      RECEIVED.
                    </h2>
                    <p className="relative mb-12 text-lg font-bold uppercase tracking-widest text-zinc-500 leading-relaxed max-w-sm mx-auto">
                      TRANSMISSION CONFIRMED. <br /> SQUAD WILL RESPOND SHORTLY.
                    </p>
                    
                    <AccentButton 
                      href="/"
                      variant="secondary"
                      className="h-16 px-12 text-lg"
                      icon={<ArrowRight size={20} />}
                    >
                      TERMINAL HOME
                    </AccentButton>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Bottom Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/5 blur-[150px] pointer-events-none" />
    </main>
  );
}
