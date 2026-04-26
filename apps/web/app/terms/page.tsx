import { Metadata } from 'next';
import Link from 'next/link';
import { SectionContainer } from '../../components/layout/SectionContainer';

export const metadata: Metadata = {
  title: 'Terms | FairShare',
  description: 'FairShare terms of service.',
};

const sections = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or using FairShare, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.',
  },
  {
    title: 'User Responsibilities',
    body: 'You are responsible for safeguarding your account and for all activities that occur under your account. You agree not to disclose your password to any third party and to notify us immediately of any breach of security or unauthorized use of your account.',
  },
  {
    title: 'Content Guidelines',
    body: 'Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the legality, reliability, and appropriateness of the content you submit.',
  },
  {
    title: 'Limitation of Liability',
    body: 'In no event shall FairShare, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 pb-10 text-center">
        <div className="mx-auto mb-8 inline-flex rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1 text-xs font-black uppercase tracking-widest text-purple-400">
          Terms of Service
        </div>
        <h1 className="hero-title mb-6 text-5xl font-black italic tracking-tighter text-white md:text-7xl lg:text-[6rem] uppercase">
          CLEAR <span className="text-purple-600">RULES.</span>
        </h1>
        <p className="mx-auto max-w-3xl text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 md:text-base">
          Guidelines and terms for using FairShare.
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
            <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">Need Support?</h2>
            <p className="mb-6 text-sm font-medium leading-7 text-zinc-300 md:text-base">
              If you have any questions about these Terms, please contact us.
            </p>
            <Link href="/contact" className="inline-flex rounded-2xl border border-white/10 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:scale-[1.02]">
              Contact Us
            </Link>
          </section>
        </div>
      </SectionContainer>
    </main>
  );
}
