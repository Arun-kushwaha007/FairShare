'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogPreviewCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  index: number;
}

export const BlogPreviewCard = ({ title, excerpt, date, category, index }: BlogPreviewCardProps) => {
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="glass-card p-10 group hover:bg-white/[0.03] transition-all flex flex-col items-stretch"
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="rounded-lg bg-purple-500/10 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/20">
          {category}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
          {date}
        </span>
      </div>
      
      <h3 className="mb-6 text-3xl font-black uppercase italic tracking-tighter text-white group-hover:text-purple-400 transition-colors leading-none">
        <Link href={`/blog/${slug}`}>
          {title}
        </Link>
      </h3>
      
      <p className="mb-10 font-bold uppercase tracking-widest text-zinc-500 leading-relaxed text-sm">
        {excerpt}
      </p>
      
      <Link
        href={`/blog/${slug}`}
        className="mt-auto px-8 py-4 border border-white/10 bg-white/5 rounded-2xl text-center text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
      >
        READ ARCHIVE
      </Link>
    </motion.div>
  );
};
