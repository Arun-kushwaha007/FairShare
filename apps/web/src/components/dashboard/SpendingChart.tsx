'use client';

import { motion } from 'framer-motion';

const chartData = [32, 58, 45, 72, 48, 65, 82, 55, 70, 90, 68, 85];
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export function SpendingChart() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-surface)] p-4 sm:p-6 transition-all hover:bg-[var(--fs-card)] shadow-[var(--fs-shadow-soft)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xs sm:text-sm font-black italic tracking-tight text-[var(--fs-text-primary)]">SPENDING FLOW</h3>
          <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[var(--fs-text-muted)] uppercase mt-0.5">Aggregate Protocol Metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <span className="text-[10px] font-bold text-[var(--fs-text-muted)] uppercase tracking-widest">2026</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
            <span className="text-[10px] font-bold text-[var(--fs-text-muted)]/60 uppercase tracking-widest">2025</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex items-end justify-between gap-2 h-44 sm:h-52 min-w-[420px]">
        {chartData.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar cursor-pointer">
            <div className="w-full relative h-[100%] flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                className="w-full rounded-md bg-gradient-to-t from-purple-600/20 to-purple-400/10 border-t border-purple-500/40"
              />
              
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                <div className="bg-[var(--fs-surface)] border border-[var(--fs-border)] px-2 py-1 rounded text-[9px] font-black text-[var(--fs-text-primary)] whitespace-nowrap shadow-xl">
                  ${(h * 32).toLocaleString()}
                </div>
              </div>

              {/* Bar Glow */}
              <div className="absolute inset-0 bg-purple-500/10 blur-xl opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-full" />
            </div>
            <span className="text-[9px] font-black text-[var(--fs-text-muted)] group-hover/bar:text-[var(--fs-primary)] transition-colors uppercase">
              {months[i]}
            </span>
          </div>
        ))}
        </div>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
        <div className="text-[8px] font-mono text-[var(--fs-text-muted)] uppercase tracking-[0.5em] vertical-text">
          SIGNAL_STRENGTH_98%
        </div>
      </div>
    </div>
  );
}
