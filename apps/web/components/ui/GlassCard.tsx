'use client';

import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
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
  const baseClasses =
    'glass-panel relative overflow-hidden rounded-3xl text-[var(--fs-text-primary)] shadow-2xl';
  const hoverClasses = hoverable
    ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[var(--fs-primary)]/20'
    : '';

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--fs-primary)]/8 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 p-5 md:p-7">{children}</div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--fs-border)] to-transparent" />
    </motion.div>
  );
}
