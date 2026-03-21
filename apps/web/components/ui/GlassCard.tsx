import { ReactNode, HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function GlassCard({ 
  children, 
  className = '', 
  hoverable = true,
  initial = { opacity: 0, y: 20 },
  whileInView = { opacity: 1, y: 0 },
  viewport = { once: true },
  transition = { duration: 0.5 },
  ...props 
}: GlassCardProps) {
  const baseClasses = "relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-xl shadow-2xl";
  const hoverClasses = hoverable ? "transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] hover:-translate-y-1" : "";

  return (
    <motion.div 
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
      {/* Skeuomorphic Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}
