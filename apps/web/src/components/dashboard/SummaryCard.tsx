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
      className="group relative overflow-hidden rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-surface)] p-4 sm:p-6 transition-all hover:border-[var(--fs-primary)]/20 hover:shadow-lg shadow-[var(--fs-shadow-soft)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--fs-primary)]/10 text-[var(--fs-text-secondary)] group-hover:text-[var(--fs-primary)] transition-colors">
          {Icon && <Icon size={18} />}
        </div>
        {change && (
          <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-amber-400' : 'text-zinc-500'}`}>
            {change}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--fs-text-primary)] italic">
          {value}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--fs-text-secondary)] group-hover:text-[var(--fs-text-primary)] transition-colors uppercase">
          {title}
        </p>
      </div>
      
      {hint ? (
        <div className="mt-6 pt-4 border-t border-[var(--fs-border)] hidden sm:flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--fs-primary)]/40" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fs-text-muted)]">
            {hint}
          </span>
        </div>
      ) : null}

      {/* Ambient Glow */}
      <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-purple-500/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
      
      {/* Top highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[var(--fs-border)] to-transparent" />

    </motion.div>
  );
}
