import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { StepCard } from '../../components/marketing/StepCard';

export const metadata: Metadata = {
  title: 'How It Works | FairShare – Five Steps to Harmony',
  description: 'Learn how to split smarter and settle faster with our five-step group expense flow.',
};

const steps = [
  {
    step: 1,
    title: 'Create a Group',
    description: 'Start a new group for your trip, housemates, or dinner out. Give it a name and a vibe.',
  },
  {
    step: 2,
    title: 'Add Friends',
    description: 'Invite your crew using their email or phone number. They\'ll be in the loop instantly.',
  },
  {
    step: 3,
    title: 'Record Expenses',
    description: 'Add bills as they happen. Snap a photo of the receipt and let us handle the splitting logic.',
  },
  {
    step: 4,
    title: 'See Balances Automatically',
    description: 'No more math. We show exactly who owes what, updated in real-time as expenses roll in.',
  },
  {
    step: 5,
    title: 'Settle Up Easily',
    description: 'Record payments and clear debts with one tap. Everyone gets notified, and the slate is wiped clean.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            Product Workflow
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          SPLIT <br className="md:hidden" /> <span className="text-purple-600">STORY.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          FIVE STEPS TO FINANCIAL HARMONY IN THE GROUP CHAT.
        </p>
      </SectionContainer>

      <SectionContainer className="max-w-4xl pb-48">
        <div className="flex flex-col gap-16">
          {steps.map((step, index) => (
            <StepCard
              key={step.step}
              index={index}
              {...step}
            />
          ))}
        </div>
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer className="mb-32">
        <div className="glass-panel text-center p-16 md:p-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
          <h2 className="relative mb-8 text-5xl font-black uppercase italic tracking-tighter md:text-8xl text-white">
            STOP THE <br className="md:hidden" /> STRESS.
          </h2>
          <a
            href="/login"
            className="relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-white/10"
          >
            START SPLITTING NOW
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
