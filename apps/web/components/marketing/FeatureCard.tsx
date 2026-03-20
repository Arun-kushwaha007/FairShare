import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Icons;
  colorClass?: string;
  eyebrow?: string;
}

export function FeatureCard({
  title,
  description,
  iconName,
  colorClass = '',
  eyebrow,
}: FeatureCardProps) {
  const Icon = (Icons[iconName] as LucideIcon) || Icons.Sparkles;

  return (
    <GlassCard className="h-full group">
      <div className="p-8">
        <div className={`relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-transform group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:border-purple-500/30`}>
          <Icon className="text-zinc-400 transition-colors group-hover:text-purple-400" size={24} />
          {/* Subtle Glow */}
          <div className="absolute inset-0 -z-10 bg-purple-500/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        
        {eyebrow && (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400/80 mb-2 block">
            {eyebrow}
          </span>
        )}
        
        <h3 className="text-xl font-bold tracking-tight text-white mb-3 group-hover:text-purple-100 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm leading-7 text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {description}
        </p>
      </div>
      
      {/* Brutalist Detail */}
      <div className="absolute bottom-0 right-0 h-10 w-10 border-r-2 border-b-2 border-white/5 group-hover:border-purple-500/20 transition-colors" />
    </GlassCard>
  );
}
