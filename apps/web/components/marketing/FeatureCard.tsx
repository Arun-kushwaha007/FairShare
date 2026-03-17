'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
  colorClass: string;
}

export const FeatureCard = ({ title, description, icon: Icon, index, colorClass }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`neo-border neo-pop-hover bg-zinc-900 p-8 flex flex-col items-start ${colorClass}`}
    >
      <div className={`mb-6 p-4 border-2 border-white bg-black`}>
        <Icon size={40} className="text-white" />
      </div>
      <h3 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">
        {title}
      </h3>
      <p className="font-bold text-zinc-400 uppercase tracking-wide leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
