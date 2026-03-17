import { useState } from 'react';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { CheckCircle2, MoveRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Waitlist | FairShare – Lock In Your Spot',
  description: 'Join the queue for early access to Pro features and beta slots.',
};

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          THE QUEUE.
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
          RESERVE YOUR SPOT IN THE NEXT GENERATION OF SHARING.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-48">
        <div className="mx-auto max-w-2xl">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="neo-border neo-shadow-purple bg-zinc-900 p-12 text-center"
            >
              <h2 className="mb-8 text-4xl font-black uppercase italic tracking-tighter text-white">
                GET EARLY ACCESS.
              </h2>
              <p className="mb-10 font-bold uppercase tracking-widest text-zinc-400">
                PRO FEATURES AND BETA SLOTS ARE LIMITED. DON\'T GET LEFT BEHIND.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  required
                  type="text"
                  placeholder="NAME"
                  className="w-full border-4 border-black bg-white px-6 py-4 font-black uppercase text-black placeholder-zinc-400 outline-none focus:bg-purple-100 transition-colors"
                />
                <input
                  required
                  type="email"
                  placeholder="EMAIL"
                  className="w-full border-4 border-black bg-white px-6 py-4 font-black uppercase text-black placeholder-zinc-400 outline-none focus:bg-purple-100 transition-colors"
                />
                <button
                  type="submit"
                  className="neo-pop-hover w-full flex items-center justify-center gap-3 border-4 border-white bg-white py-6 text-2xl font-black uppercase text-black hover:bg-purple-500 hover:text-white transition-all"
                >
                  JOIN WAITLIST <MoveRight size={28} strokeWidth={4} />
                </button>
              </form>
              
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                BY JOINING, YOU AGREE TO OUR TERMS AND PRIVACY POLICY. NO SPAM.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="neo-border bg-black p-20 text-center"
            >
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center border-4 border-white bg-cyan-400 text-black">
                <CheckCircle2 size={64} strokeWidth={3} />
              </div>
              <h2 className="mb-4 text-5xl font-black uppercase italic tracking-tighter text-white">
                YOU ARE IN.
              </h2>
              <p className="mb-12 text-xl font-bold uppercase tracking-widest text-zinc-400">
                WE HAVE DISPATCHED A VERIFICATION SIGNAL TO YOUR INBOX.
              </p>
              <a
                href="/"
                className="neo-pop-hover inline-block border-4 border-white bg-white px-10 py-5 font-black uppercase text-black hover:bg-transparent hover:text-white transition-all"
              >
                RETURN TO BASE
              </a>
            </motion.div>
          )}
        </div>
      </SectionContainer>
    </main>
  );
}
