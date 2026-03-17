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
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          HOW IT WORKS
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
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

      {/* Hero CTA */}
      <SectionContainer className="bg-white text-black border-y-4 border-black mb-32">
        <div className="text-center">
          <h2 className="mb-8 text-5xl font-black uppercase italic tracking-tighter md:text-7xl">
            STOP THE STRESS.
          </h2>
          <a
            href="/login"
            className="neo-pop-hover bg-black px-12 py-6 text-2xl font-black text-white shadow-[8px_8px_0px_0px_#a855f7] transition-all"
          >
            START SPLITTING NOW
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
