import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { BlogPreviewCard } from '../../components/marketing/BlogPreviewCard';

export const metadata: Metadata = {
  title: 'Blog | FairShare – The Log',
  description: 'Insights on the art of sharing everything. Guides, tips, and engineering deep dives.',
};

const posts = [
  {
    title: 'How to Split Trip Expenses Easily',
    excerpt: 'FROM FLIGHTS TO LATE-NIGHT TACO RUNS, WE SHOW YOU THE BEST SETUP FOR YOUR NEXT GROUP VACATION.',
    date: 'MARCH 15, 2026',
    category: 'GUIDE',
  },
  {
    title: 'Managing Roommate Bills Without Stress',
    excerpt: 'STOP THE PASSIVE-AGGRESSIVE VENMO REQUESTS. HERE IS HOW TO AUTOMATE YOUR HOUSEHOLD EXPENSES.',
    date: 'MARCH 10, 2026',
    category: 'TIPS',
  },
  {
    title: 'Best Apps for Shared Expenses',
    excerpt: 'THE LANDSCAPE IS CHANGING. WE BREAK DOWN WHY FAIRSHARE IS THE ONLY CHOICE FOR THE CURRENT META.',
    date: 'MARCH 05, 2026',
    category: 'COMPASS',
  },
  {
    title: 'Real-Time Sync Architecture',
    excerpt: 'A DEEP DIVE INTO HOW WE KEEP BALANCES UPDATED ACROSS ALL DEVICES IN UNDER 100MS.',
    date: 'FEBRUARY 28, 2026',
    category: 'ENGINE',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            Data Stream
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          THE <br className="md:hidden" /> <span className="text-purple-600">LOG.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          INSIGHTS ON THE ART OF SHARING EVERYTHING. NO FLUER.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-32">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post, index) => (
            <BlogPreviewCard
              key={post.title}
              index={index}
              {...post}
            />
          ))}
        </div>
      </SectionContainer>

      {/* Email Subscription Section */}
      <SectionContainer id="subscribe" className="mb-32">
        <div className="glass-panel p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
          <h2 className="relative mb-6 text-4xl font-black uppercase italic tracking-tighter md:text-7xl text-white">
            NEVER MISS <br className="md:hidden" /> A DROP.
          </h2>
          <p className="relative mx-auto mb-12 max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
            GET THE LATEST GUIDES AND ENGINE UPDATES SENT STRAIGHT TO YOUR INBOX.
          </p>
          <form className="relative flex flex-col gap-4 md:flex-row md:justify-center max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.XYZ" 
              className="flex-grow border border-white/10 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase placeholder-zinc-800 text-white outline-none focus:bg-white/10 transition-all text-sm tracking-widest" 
            />
            <button 
              type="submit"
              className="px-10 py-5 bg-purple-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-900/40 hover:scale-105 transition-all"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </SectionContainer>
    </main>
  );
}
