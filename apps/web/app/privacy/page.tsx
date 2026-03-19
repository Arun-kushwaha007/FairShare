import { Metadata } from 'next';
import Link from 'next/link';
import { SectionContainer } from '../../components/layout/SectionContainer';

export const metadata: Metadata = {
  title: 'Privacy | FairShare',
  description: 'FairShare privacy overview for the web demo experience.',
};

const sections = [
  {
    title: 'What we collect',
    body: 'Account details, group activity, expense data, and uploaded receipt metadata needed to operate shared-expense features.',
  },
  {
    title: 'How we use it',
    body: 'To authenticate users, calculate balances, sync activity across your groups, and support receipt uploads and notifications.',
  },
  {
    title: 'What this demo means',
    body: 'This repository is a development build. Do not treat local demo environments as a production-grade compliance deployment.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 pb-10 text-center">
        <div className="mx-auto mb-8 inline-flex rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1 text-xs font-black uppercase tracking-widest text-purple-400">
          Privacy
        </div>
        <h1 className="hero-title mb-6 text-5xl font-black italic tracking-tighter text-white md:text-7xl lg:text-[6rem] uppercase">
          DATA WITH <span className="text-purple-600">CONTEXT.</span>
        </h1>
        <p className="mx-auto max-w-3xl text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 md:text-base">
          A concise privacy overview for the current FairShare web experience.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-24">
        <div className="mx-auto grid max-w-5xl gap-8">
          {sections.map((section) => (
            <section key={section.title} className="glass-card border border-white/10 bg-white/[0.03] p-8 md:p-10">
              <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">{section.title}</h2>
              <p className="text-sm font-medium leading-7 text-zinc-300 md:text-base">{section.body}</p>
            </section>
          ))}

          <section className="glass-panel border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">Questions</h2>
            <p className="mb-6 text-sm font-medium leading-7 text-zinc-300 md:text-base">
              For repo-level questions, use the contact flow in the site footer or review the code paths that handle auth, storage, and notifications.
            </p>
            <Link href="/contact" className="inline-flex rounded-2xl border border-white/10 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:scale-[1.02]">
              Contact
            </Link>
          </section>
        </div>
      </SectionContainer>
    </main>
  );
}
