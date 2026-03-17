'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

export const FAQItem = ({ question, answer, index }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="neo-border neo-shadow-yellow overflow-hidden bg-zinc-900"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span className="text-xl font-black uppercase italic tracking-tighter text-white md:text-2xl">
          {question}
        </span>
        <div className="shrink-0 border-2 border-white bg-black p-2 text-white">
          {isOpen ? <Minus size={24} strokeWidth={4} /> : <Plus size={24} strokeWidth={4} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t-4 border-zinc-800 p-6 pt-0">
              <p className="mt-6 text-lg font-bold uppercase tracking-widest text-zinc-400">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
