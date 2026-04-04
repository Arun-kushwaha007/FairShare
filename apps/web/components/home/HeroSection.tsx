'use client';

import {
  ArrowRight,
  Sparkles,
  DollarSign,
  Users,
  TrendingDown,
  Receipt,
  Plus,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionContainer } from '../layout/SectionContainer';
import { AccentButton } from '../ui/AccentButton';
import { TiltCard } from '../ui/TiltCard';
import { staggerContainer, fadeUp } from './motion-variants';

const recentExpenses = [
  { name: 'Dinner at Nobu', paidBy: 'Alex', amount: '$248.50', split: 4, color: 'bg-purple-500' },
  { name: 'Uber to Airport', paidBy: 'Sarah', amount: '$67.20', split: 3, color: 'bg-violet-500' },
  { name: 'Groceries', paidBy: 'Mike', amount: '$132.80', split: 4, color: 'bg-indigo-500' },
];

const members = [
  { name: 'AK', color: 'from-purple-500 to-violet-600' },
  { name: 'SM', color: 'from-indigo-500 to-blue-600' },
  { name: 'JD', color: 'from-violet-500 to-purple-600' },
  { name: 'LP', color: 'from-fuchsia-500 to-pink-600' },
];

const chartData = [32, 58, 45, 72, 48, 65, 82, 55, 70, 90, 68, 85];
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export function HeroSection() {
  return (
    <SectionContainer size="spacious" className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        {[
          { top: '20%', left: '10%', delay: 0 },
          { top: '40%', left: '30%', delay: 0.8 },
          { top: '15%', left: '70%', delay: 1.6 },
          { top: '55%', left: '85%', delay: 2.4 },
          { top: '35%', left: '50%', delay: 0.4 },
          { top: '60%', left: '15%', delay: 1.2 },
          { top: '25%', left: '90%', delay: 2 },
          { top: '50%', left: '40%', delay: 3 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-purple-400"
            style={{ top: dot.top, left: dot.left }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              boxShadow: [
                '0 0 0px rgba(168,85,247,0)',
                '0 0 12px rgba(168,85,247,0.6)',
                '0 0 0px rgba(168,85,247,0)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: dot.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
      </div>

      <motion.div
        className="pointer-events-none absolute left-[3%] top-28 hidden h-16 w-40 items-center gap-3 rounded-2xl border border-white/12 bg-[#111114]/85 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md xl:flex"
        style={{ transform: 'perspective(600px) rotateY(8deg) rotateX(-3deg)' }}
        animate={{ y: [0, -12, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/15">
          <Receipt size={16} className="text-purple-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-white">Dinner Split</p>
          <p className="text-[9px] text-zinc-300">$248 · 4 ways</p>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-[4%] top-40 hidden h-14 items-center gap-2.5 rounded-full border border-emerald-400/20 bg-[#0f1913]/90 px-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md xl:flex"
        style={{ transform: 'perspective(600px) rotateY(-6deg) rotateX(4deg)' }}
        animate={{ y: [0, 10, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-[11px] font-bold text-emerald-300">All settled up!</span>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-[1%] top-[34%] hidden h-28 w-28 2xl:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-purple-500/10" />
        <motion.div
          className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-purple-400/60"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-[2%] top-[26%] hidden h-20 w-20 2xl:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-violet-500/10" />
        <motion.div
          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-400/60"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        <motion.div
          variants={fadeUp}
          className="eyebrow-label mb-6 sm:mb-8"
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={14} className="text-purple-400" />
          </motion.span>
          <span>The Premium Way to Split Expenses</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl text-balance text-[2.8rem] font-extrabold tracking-tight text-white sm:text-[3.5rem] md:text-[4rem] lg:max-w-5xl lg:text-[4.5rem] xl:text-[5rem]"
        >
          Split group expenses{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-purple-400 via-purple-500 to-violet-500 bg-clip-text text-transparent">
              without the chaos.
            </span>
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-purple-500/60 via-purple-400/80 to-violet-500/60 blur-sm"
              animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="absolute -bottom-2 left-0 right-0 h-px rounded-full bg-gradient-to-r from-purple-500 via-purple-400 to-violet-500" />
            <motion.span
              className="absolute -right-4 -top-4 h-1.5 w-1.5 rounded-full bg-purple-300"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: [-5, -15, -5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.span
              className="absolute -bottom-6 -left-3 h-1 w-1 rounded-full bg-violet-300"
              animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0], y: [5, 15, 5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-3xl text-base leading-7 text-zinc-200 sm:text-lg sm:leading-8 lg:text-xl"
        >
          FairShare helps roommates, travelers, and teams log shared spending, track balances live,
          and settle up faster. <span className="text-white">No spreadsheets required.</span>
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex w-full flex-col items-center gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:gap-4"
        >
          <AccentButton href="/waitlist" variant="primary" icon={<ArrowRight size={18} />}>
            Join the Waitlist
          </AccentButton>
          <AccentButton href="/features" variant="secondary">
            Explore Features
          </AccentButton>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400"
        >
          Android &amp; iOS App Coming Soon
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-12 w-full max-w-6xl px-0 sm:mt-14"
      >
        <TiltCard>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#08080b]/92 shadow-[0_0_80px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative p-4 sm:p-6 lg:p-8 xl:p-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">FairShare</span>
                  <span className="ml-2 hidden text-[10px] font-bold uppercase tracking-widest text-zinc-300 sm:inline">
                    Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:text-white"
                  >
                    <Bell size={14} />
                    <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-purple-500">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-[10px] font-bold text-white">
                    AK
                  </div>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {[
                  { label: 'Total Spent', value: '$2,448.50', icon: DollarSign, change: '+12%' },
                  { label: 'Group Members', value: '4', icon: Users, change: '' },
                  { label: 'You Owe', value: '$124.30', icon: TrendingDown, change: '-8%' },
                  { label: 'Expenses', value: '18', icon: Receipt, change: '+3' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-purple-500/20"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-zinc-200 transition-colors group-hover:text-purple-300">
                        <stat.icon size={14} />
                      </div>
                      {stat.change ? (
                        <span
                          className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}
                        >
                          {stat.change}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-300">
                      {stat.label}
                    </p>
                    <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-purple-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                  </motion.div>
                ))}
              </div>

              <div className="tablet-tight-grid grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">Monthly Spending</p>
                      <p className="mt-0.5 text-[10px] text-zinc-300">Group expense trend</p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-bold text-zinc-400">
                      <span className="text-purple-400">2025</span>
                      <span>2024</span>
                    </div>
                  </div>
                  <div className="flex h-28 items-end gap-1.5 sm:h-36">
                    {chartData.map((h, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <motion.div
                          className="group/bar relative w-full cursor-pointer rounded-t-md border-t border-purple-400/50 bg-gradient-to-t from-purple-600/40 to-purple-400/12"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1.4 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
                          whileHover={{ backgroundColor: 'rgba(168,85,247,0.3)' }}
                        >
                          <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold text-white group-hover/bar:block">
                            ${(h * 28).toLocaleString()}
                          </div>
                        </motion.div>
                        <span className="text-[8px] font-bold text-zinc-300">{months[i]}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Recent Expenses</p>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-300"
                    >
                      <Plus size={12} />
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {recentExpenses.map((expense, i) => (
                      <motion.div
                        key={expense.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 + i * 0.1, duration: 0.4 }}
                        whileHover={{ x: 2, transition: { duration: 0.15 } }}
                        className="group/item flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-white/10 hover:bg-white/5"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${expense.color}`}
                        >
                          <Receipt size={12} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-white">{expense.name}</p>
                          <p className="text-[10px] text-zinc-300">
                            {expense.paidBy} · Split {expense.split} ways
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-white">
                            {expense.amount}
                          </span>
                          <ChevronRight
                            size={12}
                            className="text-zinc-300 opacity-0 transition-opacity group-hover/item:opacity-100"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex -space-x-2">
                      {members.map((m, i) => (
                        <motion.div
                          key={m.name}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2 + i * 0.08, type: 'spring', stiffness: 300 }}
                          whileHover={{ y: -3, zIndex: 10, transition: { duration: 0.15 } }}
                          className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br text-[9px] font-bold text-white ${m.color}`}
                        >
                          {m.name}
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300">4 members</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </TiltCard>

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-2 -top-2 hidden h-20 w-20 rotate-12 rounded-2xl border border-purple-500/20 bg-purple-500/8 shadow-[0_0_40px_rgba(168,85,247,0.1)] backdrop-blur-sm sm:-right-6 sm:-top-6 sm:block sm:h-24 sm:w-24"
        >
          <div className="flex h-full w-full items-center justify-center">
            <DollarSign size={28} className="text-purple-400/40" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-2 -left-2 hidden h-16 w-16 -rotate-6 rounded-2xl border border-violet-500/20 bg-violet-500/8 shadow-[0_0_40px_rgba(139,92,246,0.1)] backdrop-blur-sm sm:-bottom-6 sm:-left-6 sm:block sm:h-20 sm:w-20"
        >
          <div className="flex h-full w-full items-center justify-center">
            <Users size={22} className="text-violet-400/40" />
          </div>
        </motion.div>

        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-[52px]" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-purple-900/18 blur-[52px]" />
      </motion.div>
    </SectionContainer>
  );
}
