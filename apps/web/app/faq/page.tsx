import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { FAQItem } from '../../components/marketing/FAQItem';

export const metadata: Metadata = {
  title: 'FAQ | FairShare – No Gatekeeping',
  description: 'Common questions about expense splitting, settlements, security, and our mobile apps.',
};

const faqs = [
  {
    question: 'What is FairShare?',
    answer: 'FAIRSHARE IS A NEXT-GEN EXPENSE SHARING APP. IT HANDLES THE MATH, THE BALANCES, AND THE SETTLEMENTS SO YOU CAN FOCUS ON THE VIBES.',
  },
  {
    question: 'How does expense splitting work?',
    answer: 'YOU ADD AN EXPENSE, SELECT THE SQUAD, AND CHOOSE THE SPLIT METHOD (EQUALLY, EXACT, OR %). WE TRACK THE DEBT AND UPDATE BALANCES INSTANTLY.',
  },
  {
    question: 'Is the app free?',
    answer: 'THE MVP IS 100% FREE. WE\'RE BUILDING PRO FEATURES (AI SCANNING, DEEP ANALYTICS) THAT WILL LAUNCH LATER FOR A SMALL MONTHLY FEE.',
  },
  {
    question: 'Will Android and iOS apps be available?',
    answer: 'YES. WE ARE CURRENTLY IN BETA ON WEB. NATIVE MOBILE APPS ARE HITING THE STORES SOON. STAY LOCKED IN.',
  },
  {
    question: 'How do settlements work?',
    answer: 'ONCE YOU\'RE READY TO CLEAR THE SLATE, RECORD A PAYMENT. OUR DEBT SIMPLIFIER ENSURES THE MINIMUM NUMBER OF TRANSACTIONS ARE NEEDED.',
  },
  {
    question: 'Is my data secure?',
    answer: 'FACTS. WE USE SECURE AUTHENTICATION AND CLOUD-BASE STORAGE WITH ENCRYPTION TO KEEP YOUR SQUAD\'S DATA PRIVATE.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            Protocol Intelligence
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          LOGI <br className="md:hidden" /> <span className="text-purple-600">STICS.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          WE HAVE ANSWERS. NO GATEKEEPING. EVERYTHING YOU NEED TO KNOW.
        </p>
      </SectionContainer>

      <SectionContainer className="max-w-4xl pb-48">
        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              index={index}
              {...faq}
            />
          ))}
        </div>
      </SectionContainer>

      {/* Support CTA */}
      <SectionContainer className="mb-32 text-center">
        <div className="glass-panel p-16 md:p-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <h2 className="relative mb-8 text-4xl font-black uppercase italic tracking-tighter md:text-8xl text-white">
            STILL <br className="md:hidden" /> CONFUSED?
          </h2>
          <a
            href="/contact"
            className="relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-white/10"
          >
            CONTACT SUPPORT
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
