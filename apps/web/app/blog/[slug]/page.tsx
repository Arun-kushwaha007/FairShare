'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  ChevronRight,
  Command,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { GridBackground } from '../../../components/home';
import { fadeUp, staggerContainer } from '../../../components/home/motion-variants';
import { GlassCard } from '../../../components/ui/GlassCard';
import posts from '../../../src/data/blog-posts.json';

export default function BlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#030303] text-white p-6">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-6">SIGNAL LOST.</h1>
          <p className="text-zinc-500 mb-8">The requested blog entry could not be located in the protocol.</p>
          <Link href="/blog">
            <button className="px-8 py-3 rounded-xl bg-purple-600 font-bold uppercase tracking-widest text-xs hover:bg-purple-500 transition-all">
              Return to Log
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const relatedPosts = posts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30 font-sans">
      {/* ── Background Infrastructure ── */}
      <GridBackground />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.01] to-transparent" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute top-[0%] left-1/2 -translate-x-1/2 h-[600px] w-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.03),transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] bg-indigo-600/5 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 pt-32 pb-44">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <Link href="/blog" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/5 bg-white/5 group-hover:border-purple-500/50 transition-all">
              <ArrowLeft size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Log</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-20"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8 text-purple-400">
            <div className="px-3 py-1 rounded-lg border border-purple-500/20 bg-purple-500/5 text-[10px] font-bold uppercase tracking-widest">
              {post.category}
            </div>
            <div className="h-1 w-1 rounded-full bg-zinc-800" />
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <Clock size={12} />
              {post.readTime} Read
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-[0.9] text-white mb-10"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            variants={fadeUp}
            className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-white font-bold">
                {post.author[0]}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">Reported By</p>
                <p className="text-xs font-bold text-white">{post.author}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-zinc-500">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">Signal Date</p>
                <p className="text-xs font-bold text-white">{post.date}</p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Article Content */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-purple max-w-none 
            prose-h3:text-2xl prose-h3:font-black prose-h3:italic prose-h3:tracking-tighter prose-h3:mt-12
            prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium
            prose-li:text-zinc-400 prose-li:text-lg
            pb-32 border-b border-white/5"
        >
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('### ')) {
              return <h3 key={i}>{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('# ')) {
              return null; // Skip title as it's in the header
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i}>{line}</p>;
          })}
        </motion.article>

        {/* Related Entries */}
        <section className="pt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black italic tracking-tighter text-white">RELATED SIGNALS</h2>
            <div className="h-px flex-grow mx-8 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {relatedPosts.map(rel => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                <GlassCard className="p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-4">{rel.category}</p>
                  <h4 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">{rel.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
                    Access Entry <ArrowUpRight size={12} />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="py-24 text-center border-t border-white/5 bg-[#010101]">
        <div className="flex justify-center mb-8">
          <div className="px-6 py-2 rounded-2xl border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700">
            End of Record // Protocol Secure
          </div>
        </div>
      </footer>
    </main>
  );
}
