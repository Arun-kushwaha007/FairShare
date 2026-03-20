'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  withAnimation?: boolean;
  size?: 'default' | 'compact' | 'spacious';
}

export const SectionContainer = ({
  children,
  className = '',
  id,
  withAnimation = false,
  size = 'default',
}: SectionContainerProps) => {
  const spacingClass =
    size === 'compact'
      ? 'py-14 sm:py-16 lg:py-20'
      : size === 'spacious'
        ? 'py-20 sm:py-24 lg:py-28'
        : 'py-16 sm:py-20 lg:py-24';

  const content = (
    <div className={`mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );

  if (!withAnimation) {
    return <section id={id} className={spacingClass}>{content}</section>;
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={spacingClass}
    >
      {content}
    </motion.section>
  );
};
