'use client';

import { ReactNode } from 'react';
import { 
  LucideIcon, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Receipt, 
  TrendingDown,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const ICON_MAP: Record<string, LucideIcon> = {
  dollar: DollarSign,
  users: Users,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  receipt: Receipt,
  activity: Activity,
};

export function SummaryCard({
  title,
  value,
  hint,
  icon: iconName,
  change,
  trend = 'neutral'
}: {
  title: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const Icon = iconName ? ICON_MAP[iconName] : null;
  return (
    <motion.div 
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-purple-500/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-500 group-hover:text-purple-400 transition-colors">
          {Icon && <Icon size={18} />}
        </div>
        {change && (
          <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-amber-400' : 'text-zinc-500'}`}>
            {change}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white italic">
          {value}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {title}
        </p>
      </div>
      
      {hint ? (
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            {hint}
          </span>
        </div>
      ) : null}

      {/* Ambient Glow */}
      <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-purple-500/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
      
      {/* Top highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </motion.div>
  );
}
