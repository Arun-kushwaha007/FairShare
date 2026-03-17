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
      transition={{ duration: 0.5, delay }}
      className={`relative flex flex-col items-stretch neo-border ${colorClass} bg-zinc-900 p-10`}
    >
      {isPopular && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white bg-yellow-400 px-6 py-2 text-sm font-black uppercase text-black italic">
          BEST FOR SQUADS
        </div>
      )}
      
      <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
        {name}
      </h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-6xl font-black italic tracking-tighter text-white">{price}</span>
        {price !== 'FREE' && <span className="text-lg font-bold text-zinc-500 uppercase">/MO</span>}
      </div>
      
      <p className="mb-8 font-bold uppercase tracking-widest text-zinc-400">
        {description}
      </p>
      
      <ul className="mb-12 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-4 font-bold uppercase tracking-widest text-white">
            <Check className="shrink-0 text-cyan-400" size={20} strokeWidth={4} />
            {feature}
          </li>
        ))}
      </ul>
      
      <a
        href={buttonHref}
        className="neo-pop-hover mt-auto border-4 border-white bg-white px-8 py-4 text-center text-xl font-black uppercase text-black hover:bg-transparent hover:text-white transition-all"
      >
        {buttonText}
      </a>
    </motion.div>
  );
};
