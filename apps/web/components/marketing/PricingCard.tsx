'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isPopular?: boolean;
  colorClass: string;
  delay: number;
}

export const PricingCard = ({ 
  name, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonHref, 
  isPopular, 
  colorClass,
  delay 
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`relative flex flex-col items-stretch glass-card p-10 group overflow-hidden ${isPopular ? 'ring-2 ring-purple-500/50' : ''}`}
    >
      {isPopular && (
        <div className="absolute -right-12 top-8 rotate-45 bg-purple-600 px-12 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
          BEST VALUE
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">
          {name}
        </h3>
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
          {description}
        </p>
      </div>

      <div className="flex items-baseline gap-2 mb-10">
        <span className="text-6xl font-black italic tracking-tighter text-white">{price}</span>
        {price !== 'FREE' && <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">/ MONTHLY</span>}
      </div>
      
      <ul className="mb-12 space-y-5 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-4 text-sm font-bold uppercase tracking-widest text-zinc-300">
            <div className="mt-0.5 rounded-full bg-purple-500/10 p-1">
              <Check className="shrink-0 text-purple-400" size={14} strokeWidth={4} />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      
      <a
        href={buttonHref}
        className={`px-8 py-4 text-center text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${
          isPopular 
            ? 'bg-white text-black hover:scale-105 shadow-xl shadow-white/5' 
            : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
        }`}
      >
        {buttonText}
      </a>
    </motion.div>
  );
};
