import { Metadata } from 'next';
import Link from 'next/link';
import { SectionContainer } from '../../components/layout/SectionContainer';

export const metadata: Metadata = {
  title: 'Terms | FairShare',
  description: 'FairShare terms overview for the web demo experience.',
};

const sections = [
  {
    title: 'Use of the app',
    body: 'Use FairShare for lawful collaboration around shared expenses. You are responsible for the accuracy of data you enter into the app.',
  },
  {
    title: 'Demo limitations',
    body: 'This repository includes local-development behavior, mock credentials, and optional infrastructure. Features may be incomplete or unavailable without the required services.',
  },
  {
    title: 'Uploaded content',
    body: 'Only upload receipts and content you are permitted to store and process. Local development environments are your responsibility to secure.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 pb-10 text-center">
        <div className="mx-auto mb-8 inline-flex rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1 text-xs font-black uppercase tracking-widest text-purple-400">
          Terms
        </div>
        <h1 className="hero-title mb-6 text-5xl font-black italic tracking-tighter text-white md:text-7xl lg:text-[6rem] uppercase">
          CLEAR <span className="text-purple-600">RULES.</span>
        </h1>
        <p className="mx-auto max-w-3xl text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 md:text-base">
          A short terms overview for using the current FairShare demo and development environment.
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
            <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">Need support</h2>
            <p className="mb-6 text-sm font-medium leading-7 text-zinc-300 md:text-base">
              If a local setup issue blocks you, start the required backend services first, then retry the web and mobile clients.
            </p>
            <Link href="/faq" className="inline-flex rounded-2xl border border-white/10 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:scale-[1.02]">
              Open FAQ
            </Link>
          </section>
        </div>
      </SectionContainer>
    </main>
  );
}
