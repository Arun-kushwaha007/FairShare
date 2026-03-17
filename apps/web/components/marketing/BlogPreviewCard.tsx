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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="neo-border neo-pop-hover flex flex-col items-stretch bg-zinc-900 p-8"
    >
      <div className="mb-6 flex gap-3">
        <span className="border-2 border-white bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400">
          {category}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {date}
        </span>
      </div>
      
      <h3 className="mb-4 text-3xl font-black uppercase italic tracking-tighter text-white hover:text-yellow-400 transition-colors">
        <Link href={`/blog/${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </Link>
      </h3>
      
      <p className="mb-8 font-bold uppercase tracking-widest text-zinc-400 leading-relaxed">
        {excerpt}
      </p>
      
      <Link
        href={`/blog/${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="mt-auto border-4 border-white bg-black py-4 text-center font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
      >
        READ POST
      </Link>
    </motion.div>
  );
};
