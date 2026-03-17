'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  withAnimation?: boolean;
}

export const SectionContainer = ({ 
  children, 
  className = '', 
  id, 
  withAnimation = true 
}: SectionContainerProps) => {
  const content = (
    <div className={`mx-auto max-w-7xl px-6 ${className}`}>
      {children}
    </div>
  );

  if (!withAnimation) {
    return <section id={id} className="py-20 md:py-32">{content}</section>;
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="py-20 md:py-32"
    >
      {content}
    </motion.section>
  );
};
