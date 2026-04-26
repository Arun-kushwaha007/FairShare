import { Metadata } from 'next';
import Link from 'next/link';
import { SectionContainer } from '../../components/layout/SectionContainer';

export const metadata: Metadata = {
  title: 'Privacy | FairShare',
  description: 'FairShare privacy overview.',
};

const sections = [
  {
    title: 'Information We Collect',
    body: 'We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We may use the information we collect to provide, maintain, and improve our services, including to process transactions, send related information (such as confirmations and receipts), authenticate users, and send technical notices or administrative messages.',
  },
  {
    title: 'Information Sharing',
    body: 'We do not sell your personal information. We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf, or when required by law or to protect our rights.',
  },
  {
    title: 'Data Security',
    body: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.',
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
          YOUR DATA, <span className="text-purple-600">PROTECTED.</span>
        </h1>
        <p className="mx-auto max-w-3xl text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 md:text-base">
          Our commitment to your privacy and data security.
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
            <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">Contact Us</h2>
            <p className="mb-6 text-sm font-medium leading-7 text-zinc-300 md:text-base">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us.
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
