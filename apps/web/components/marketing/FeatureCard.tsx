'use client';

import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  index: number;
}

export const FeatureCard = ({ title, description, icon: Icon, colorClass }: FeatureCardProps) => {
  return (
    <div className="glass-card p-10 group hover:bg-zinc-900/80">
      <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 p-3 shadow-lg ${colorClass} bg-black/40 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={32} className="text-white" />
      </div>
      <h3 className="mb-4 text-2xl font-black uppercase italic tracking-tighter text-white">
        {title}
      </h3>
      <p className="font-bold uppercase tracking-widest text-zinc-500 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};
