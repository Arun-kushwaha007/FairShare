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
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          LOGISTICS.
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
          WE HAVE ANSWERS. NO GATEKEEPING.
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

      <SectionContainer className="bg-zinc-900 border-y-4 border-white mb-20 text-center">
        <h2 className="mb-8 text-4xl font-black uppercase italic tracking-tighter md:text-6xl text-white">
          STILL CONFUSED?
        </h2>
        <a
          href="/contact"
          className="neo-pop-hover border-4 border-white bg-white px-12 py-6 text-2xl font-black text-black hover:bg-transparent hover:text-white transition-all"
        >
          CONTACT SUPPORT
        </a>
      </SectionContainer>
    </main>
  );
}
