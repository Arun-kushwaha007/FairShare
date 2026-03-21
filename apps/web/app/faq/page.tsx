'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  Network,
  Search,
  MessageSquare
} from 'lucide-react';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { GridBackground, FloatingOrb } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';

const faqs = [
  {
    icon: <Network size={20} />,
    question: 'What is FairShare?',
    answer: 'FAIRSHARE IS A NEXT-GEN EXPENSE SHARING APP. IT HANDLES THE MATH, THE BALANCES, AND THE SETTLEMENTS SO YOU CAN FOCUS ON THE VIBES.',
  },
  {
    icon: <Zap size={20} />,
    question: 'How does splitting work?',
    answer: 'YOU ADD AN EXPENSE, SELECT THE SQUAD, AND CHOOSE THE SPLIT METHOD (EQUALLY, EXACT, OR %). WE TRACK THE DEBT AND UPDATE BALANCES INSTANTLY.',
  },
  {
    icon: <ShieldCheck size={20} />,
    question: 'Is it free?',
    answer: 'THE PRO FEATURES ARE COMPLETELY FREE BECAUSE WE ARE OPEN SOURCE. NO SUBSCRIPTIONS, NO PAYWALLS, JUST PURE UTILITY.',
  },
  {
    icon: <Smartphone size={20} />,
    question: 'Mobile apps?',
    answer: 'YES. WE ARE IN BETA ON WEB. NATIVE MOBILE APPS ARE HITTING THE STORES SOON. STAY LOCKED IN.',
  },
  {
    icon: <Cpu size={20} />,
    question: 'Settlements?',
    answer: 'ONCE YOU\'RE READY TO CLEAR THE SLATE, RECORD A PAYMENT. OUR DEBT SIMPLIFIER ENSURES THE MINIMUM NUMBER OF TRANSACTIONS ARE NEEDED.',
  },
  {
    icon: <MessageSquare size={20} />,
    question: 'Is my data secure?',
    answer: 'FACTS. WE USE SECURE AUTHENTICATION AND CLOUD-BASE STORAGE WITH ENCRYPTION TO KEEP YOUR SQUAD\'S DATA PRIVATE.',
  },
];

function FAQNode({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      className="group relative"
    >
      <GlassCard 
        className={`relative cursor-pointer transition-all duration-500 overflow-hidden ${
          isOpen ? 'ring-2 ring-purple-500/30 bg-purple-500/[0.03]' : 'hover:bg-white/[0.02]'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start gap-6">
          <div className={`mt-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition-colors ${
            isOpen ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-zinc-500 group-hover:text-zinc-300'
          }`}>
            {faq.icon}
          </div>
          
          <div className="flex-grow pt-2">
            <div className="flex items-center justify-between gap-4">
              <h3 className={`text-xl font-bold tracking-tight transition-colors ${
                isOpen ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              }`}>
                {faq.question}
              </h3>
              <div className={`rounded-full p-1.5 transition-all duration-300 ${
                isOpen ? 'bg-purple-500/20 text-purple-400 rotate-180' : 'bg-white/5 text-zinc-600'
              }`}>
                <Plus size={16} />
              </div>
            </div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="pt-6 pb-2">
                    <p className="text-sm font-bold uppercase tracking-widest leading-relaxed text-zinc-500">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Animated Background Highlight */}
        <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none ${
          isOpen ? 'opacity-100' : ''
        }`} />
      </GlassCard>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white">
      <GridBackground />
      
      {/* Floating Ambient Effects */}
      <FloatingOrb className="top-[5%] right-[5%] h-[500px] w-[500px] bg-purple-600/5 blur-[120px]" delay={0} />
      <FloatingOrb className="bottom-[15%] left-[5%] h-[400px] w-[400px] bg-indigo-600/5 blur-[100px]" delay={3} />

      <SectionContainer className="relative pt-44 text-center sm:pt-52">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <div className="eyebrow-label bg-purple-500/5 text-purple-400 border-purple-500/20 px-6">
              <HelpCircle size={12} className="fill-purple-400/20" />
              <span>Protocol Intelligence</span>
            </div>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7.5rem] leading-[0.8] uppercase mb-10"
          >
            LOGI <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">STICS.</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-[0.25em] text-zinc-500"
          >
            WE HAVE ANSWERS. NO GATEKEEPING. EVERYTHING YOU NEED TO KNOW.
          </motion.p>
        </motion.div>
      </SectionContainer>

      <SectionContainer className="relative max-w-5xl pb-32">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-1"
        >
          {faqs.map((faq, index) => (
            <FAQNode
              key={faq.question}
              index={index}
              faq={faq}
            />
          ))}
        </motion.div>
      </SectionContainer>

      {/* Support CTA */}
      <SectionContainer className="pb-48">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-purple-900/10 via-black to-zinc-900/10 p-16 md:p-32 text-center shadow-3xl"
        >
          {/* Internal Glow Effects */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-10"
            >
              <Sparkles size={10} className="text-purple-400" />
              <span>Still Confused?</span>
            </motion.div>
            
            <h2 className="mb-12 text-5xl font-black uppercase italic tracking-tighter md:text-8xl lg:text-9xl text-white">
              SQUAD <span className="text-zinc-800 outline-text">LEVEL</span> SUPPORT.
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <AccentButton 
                href="/contact" 
                variant="primary" 
                className="h-16 px-12 text-lg"
                icon={<ArrowRight size={20} />}
              >
                CONTACT SUPPORT
              </AccentButton>
            
            </div>
          </div>
        </motion.div>
      </SectionContainer>
      
      {/* Bottom Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/5 blur-[150px] pointer-events-none" />
    </main>
  );
}
