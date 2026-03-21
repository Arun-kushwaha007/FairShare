'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Users, 
  Receipt, 
  PieChart, 
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Command,
  Zap,
  BookOpen,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { GridBackground } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';
import posts from '../../src/data/blog-posts.json';

export default function BlogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30 font-sans">
      {/* ── Background Infrastructure ── */}
      <GridBackground />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute top-[0%] left-1/2 -translate-x-1/2 h-[500px] w-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05),transparent_70%)] blur-[80px]" />
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] bg-indigo-600/5 blur-[180px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                <Command size={12} />
                <span>Intelligence Stream</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-6xl font-black tracking-tighter md:text-8xl lg:text-[7.5rem] leading-[0.85] text-white mb-10"
            >
              THE <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">LOG.</span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-500 leading-relaxed font-medium"
            >
              Unfiltered insights into the engineering, dynamics, and future arc of group financial technology.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="relative py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2"
          >
            {posts.map((post, idx) => (
              <motion.div key={post.slug} variants={fadeUp}>
                <Link href={`/blog/${post.slug}`} className="block group h-full">
                  <GlassCard className="h-full p-8 md:p-10 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative overflow-hidden flex flex-col">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div className="px-3 py-1 rounded-lg border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                        {post.category}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                        <Clock size={12} />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-4 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-500 font-medium leading-relaxed mb-8 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        {post.date}
                      </span>
                      <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                        Read Entry <ArrowUpRight size={14} className="text-purple-500" />
                      </div>
                    </div>

                    {/* Ambient Glow on Hover */}
                    <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-purple-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="relative py-48 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-16 md:p-24 text-center overflow-hidden shadow-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic text-white mb-6">
              NEVER MISS <br />
              <span className="text-zinc-700">A DROP.</span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-500 mb-12 font-medium">
              Join the synchronization. Get architecture updates and guides delivered to your inbox.
            </p>
            
            <div className="max-w-md mx-auto relative group">
              <input 
                type="email" 
                placeholder="YOUR@IDENTITY.XYZ" 
                className="w-full h-18 bg-white/[0.02] border border-white/5 rounded-2xl px-6 font-bold uppercase tracking-widest text-sm text-white placeholder-zinc-800 outline-none focus:border-purple-500/50 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-purple-600 text-xs font-black uppercase tracking-widest text-white hover:bg-purple-500 transition-all shadow-xl shadow-purple-900/20">
                Sync
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-24 text-center border-t border-white/5 bg-[#010101]">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">
          Intelligence Protocol // FairShare Engineering © 2024
        </p>
      </footer>
    </main>
  );
}
