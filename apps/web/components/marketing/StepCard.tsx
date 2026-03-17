'use client';

import { motion } from 'framer-motion';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  index: number;
}

export const StepCard = ({ step, title, description, index }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative flex flex-col items-center gap-12 md:flex-row md:items-start"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl font-black italic text-purple-500 shadow-2xl backdrop-blur-xl ring-4 ring-white/5">
        {step}
      </div>
      <div className="glass-card p-10 text-center md:text-left flex-grow">
        <h3 className="mb-4 text-3xl font-black uppercase italic tracking-tighter text-white">
          {title}
        </h3>
        <p className="text-lg font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
          {description}
        </p>
      </div>
      {/* Connector line for desktop */}
      {index < 3 && (
        <div className="absolute left-10 top-24 -z-10 hidden h-32 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent md:block" />
      )}
    </motion.div>
  );
};
