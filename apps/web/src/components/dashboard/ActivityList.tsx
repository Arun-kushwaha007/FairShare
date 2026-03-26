'use client';

import Link from 'next/link';
import { ActivityDto } from '@fairshare/shared-types';
import { Clock, Receipt, Users, Plus, Trash2, UserPlus, Milestone, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

function getIconForType(type: ActivityDto['type']) {
  switch (type) {
    case 'expense_created': return { Icon: Plus, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'expense_updated': return { Icon: Receipt, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    case 'expense_deleted': return { Icon: Trash2, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    case 'settlement_created': return { Icon: Milestone, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
    case 'member_joined': return { Icon: UserPlus, color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' };
    default: return { Icon: ActivitySquare, color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };
  }
}

function labelForType(type: ActivityDto['type']): string {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

import { ActivitySquare } from 'lucide-react';

export function ActivityList({ items = [], groupId = '' }: { items?: ActivityDto[]; groupId?: string }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-4 sm:p-6 transition-all hover:bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
        <div>
          <h2 className="text-sm font-black italic tracking-tight text-white uppercase">Live Signals</h2>
          <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mt-0.5">Real-time ledger audit</p>
        </div>
        <Link
          href={`/dashboard/activity?groupId=${encodeURIComponent(groupId)}`}
          className="group/link flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
        >
          Timeline <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {safeItems.map((item, idx) => {
          const { Icon, color } = getIconForType(item.type);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 sm:gap-4 group/item cursor-pointer"
            >
              <div className={`h-8 w-8 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl border ${color}`}>
                <Icon size={16} />
              </div>
              
              <div className="flex-grow min-w-0">
                <p className="text-xs font-black tracking-tight text-white group-hover:text-purple-400 transition-colors truncate">
                  {labelForType(item.type)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="h-0.5 w-0.5 rounded-full bg-zinc-800" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-800">
                    Protocol Signal
                  </p>
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="h-8 w-8 rounded-full border border-white/5 flex items-center justify-center text-[8px] font-black text-zinc-700 uppercase">
                  FS
                </div>
              </div>
            </motion.div>
          );
        })}

        {safeItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/5 p-10 text-center">
            <div className="mx-auto w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-800 mb-4">
              <Milestone size={18} />
            </div>
            <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">NO_SIGNAL_DETECTED</p>
          </div>
        )}
      </div>
    </div>
  );
}
