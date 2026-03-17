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
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex flex-col items-center gap-8 md:flex-row md:items-start"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center border-4 border-white bg-yellow-400 text-4xl font-black text-black shadow-[6px_6px_0px_0px_white]">
        {step}
      </div>
      <div className="neo-border bg-zinc-900 p-8 text-center md:text-left">
        <h3 className="mb-4 text-3xl font-black uppercase italic tracking-tighter text-white">
          {title}
        </h3>
        <p className="text-xl font-bold uppercase tracking-widest text-zinc-400">
          {description}
        </p>
      </div>
      {/* Connector line for desktop */}
      {index < 4 && (
        <div className="absolute left-10 top-20 -z-10 hidden h-32 w-1 bg-zinc-800 md:block" />
      )}
    </motion.div>
  );
};
