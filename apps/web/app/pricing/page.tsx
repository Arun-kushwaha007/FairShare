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
    colorClass: '',
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
    colorClass: '',
    delay: 0.2,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            Pricing Plans
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          NO <span className="text-purple-600">CAP.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          KEEP IT SIMPLE. SCALE WITH THE SQUAD. NO HIDDEN FEES.
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
        
        <div className="mt-20 glass-panel p-10 text-center max-w-4xl mx-auto border-dashed border-white/10 bg-white/[0.02]">
          <p className="font-bold uppercase tracking-[0.2em] text-zinc-500 text-sm">
            PRO FEATURES ARE CURRENTLY IN DEVELOPMENT. 
            <br />
            <span className="text-white">JOIN THE WAITLIST TO GET EARLY ACCESS WHEN WE LAUNCH.</span>
          </p>
        </div>
      </SectionContainer>

      {/* FAQ Link Section */}
      <SectionContainer className="mb-20">
        <div className="glass-panel p-10 md:p-20 flex flex-col items-center justify-between gap-12 md:flex-row relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
          <div className="text-center md:text-left relative">
            <h2 className="mb-4 text-4xl font-black uppercase italic tracking-tighter md:text-7xl text-white">
              QUESTIONS?
            </h2>
            <p className="text-lg font-bold uppercase tracking-widest text-zinc-500">
              WE HAVE ANSWERS. NO GATEKEEPING.
            </p>
          </div>
          <a
            href="/faq"
            className="relative px-12 py-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl text-2xl font-black italic tracking-tighter text-white hover:bg-white/10 transition-all uppercase"
          >
            PEEP THE FAQ
          </a>
        </div>
      </SectionContainer>
    </main>
  );
}
