'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, DollarSign, Wallet } from 'lucide-react';
import { SectionContainer } from '../layout/SectionContainer';
import { AccentButton } from '../ui/AccentButton';
import { fadeUp, staggerContainer } from '../home/motion-variants';

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="relative w-full overflow-x-clip py-3 sm:py-8">
      {/* Background Section Glow - Deep & Wide */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/[0.03] to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_70%)]" />
      </div>

      {/* Floating 3D Icons - Placed further out for "Full Width" feel */}
      <div className="pointer-events-none absolute inset-0 z-0 mx-auto max-w-7xl px-6">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-12 left-0 hidden h-24 w-24 items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl lg:flex shadow-2xl shadow-purple-500/5"
        >
          <DollarSign size={32} className="text-purple-400/30" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-12 right-0 hidden h-20 w-20 items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl lg:flex shadow-2xl shadow-indigo-500/5"
        >
          <Wallet size={24} className="text-indigo-400/30" />
        </motion.div>
        
        {/* Abstract Sparkle bits */}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 right-20 hidden lg:block"
        >
          <Sparkles size={20} className="text-purple-500/20" />
        </motion.div>
      </div>

      <SectionContainer size="compact" className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            {eyebrow && (
              <motion.div variants={fadeUp} className="mb-8 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                  <Zap size={12} className="fill-purple-400/20" />
                  {eyebrow}
                </div>
              </motion.div>
            )}
            
            <motion.h2 
              variants={fadeUp}
              className="text-5xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              {title.split('?').map((part, i) => (
                <span key={i} className="block last:inline">
                  {part}
                  {i === 0 && title.includes('?') && '?'}
                </span>
              ))}
            </motion.h2>
            
            <motion.p 
              variants={fadeUp}
              className="mt-10 px-4 text-lg leading-relaxed text-zinc-400 sm:text-xl md:px-0"
            >
              {description}
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <AccentButton href={primaryHref} variant="primary" className="h-14 px-10 text-lg" icon={<ArrowRight size={20} />}>
                {primaryLabel}
              </AccentButton>
              {secondaryLabel && secondaryHref && (
                <AccentButton href={secondaryHref} variant="secondary" className="h-14 px-10 text-lg">
                  {secondaryLabel}
                </AccentButton>
              )}
            </motion.div>
            
            <motion.div 
              variants={fadeUp}
              className="mt-16 flex items-center justify-center gap-6 opacity-40"
            >
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-white/20" />
              {/* <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                Join 5,000+ groups today
              </p> */}
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-white/20" />
            </motion.div>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Subtle Bottom Divider - Clean merge with next section or footer */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
