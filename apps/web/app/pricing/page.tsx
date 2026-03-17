import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { PricingCard } from '../../components/marketing/PricingCard';

export const metadata: Metadata = {
  title: 'Pricing | FairShare – No Cap Pricing',
  description: 'Keep it simple with our free tier, or lock in for Pro features coming soon.',
};

const plans = [
  {
    name: 'Free',
    price: 'FREE',
    description: 'ESSENTIALS FOR THE GROUP HOUSEHOLD.',
    features: [
      'Unlimited groups',
      'Basic splitting',
      'Activity tracking',
      'Debt simplification',
      'Cloud sync',
    ],
    buttonText: 'GET STARTED',
    buttonHref: '/login',
    colorClass: 'neo-shadow-cyan',
    delay: 0.1,
  },
  {
    name: 'Pro',
    price: '$5',
    description: 'POWER TOOLS FOR POWER SPLITTERS.',
    features: [
      'Everything in Free',
      'AI receipt parsing',
      'Advanced analytics',
      'Budget insights',
      'Smart suggestions',
      'Priority support',
    ],
    buttonText: 'LOCK IN (SOON)',
    buttonHref: '/waitlist',
    isPopular: true,
    colorClass: 'neo-shadow-purple',
    delay: 0.2,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          NO CAP PRICING.
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
          KEEP IT SIMPLE. SCALE WITH THE SQUAD.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-32">
        <div className="grid gap-12 md:grid-cols-2 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
            />
          ))}
        </div>
        
        <div className="mt-20 neo-border bg-black p-8 text-center max-w-4xl mx-auto border-dashed">
          <p className="font-bold uppercase tracking-[0.2em] text-zinc-500">
            PRO FEATURES ARE CURRENTLY IN DEVELOPMENT. 
            <br />
            <span className="text-yellow-400">JOIN THE WAITLIST TO GET EARLY ACCESS WHEN WE LAUNCH.</span>
          </p>
        </div>
      </SectionContainer>

      {/* FAQ Link Section */}
      <SectionContainer className="bg-zinc-900 border-y-4 border-white mb-20">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="mb-2 text-3xl font-black uppercase italic tracking-tighter md:text-5xl">
              QUESTIONS?
            </h2>
            <p className="text-xl font-bold uppercase tracking-widest text-zinc-400">
              WE HAVE ANSWERS. NO GATEKEEPING.
            </p>
          </div>
          <a
            href="/faq"
            className="neo-pop-hover border-4 border-white bg-black px-12 py-6 text-2xl font-black text-white hover:bg-yellow-400 hover:text-black transition-all"
          >
            PEEP THE FAQ
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
