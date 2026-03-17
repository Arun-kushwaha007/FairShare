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
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          THE LOG.
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
          INSIGHTS ON THE ART OF SHARING EVERYTHING.
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

      {/* Email Subscription Section (Reuse) */}
      <SectionContainer id="subscribe" className="bg-zinc-900 border-y-4 border-white mb-32">
        <div className="text-center">
          <h2 className="mb-6 text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
            NEVER MISS A DROP.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
            GET THE LATEST GUIDES AND ENGINE UPDATES SENT STRAIGHT TO YOUR INBOX.
          </p>
          <form className="flex flex-col gap-4 md:flex-row md:justify-center">
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.XYZ" 
              className="border-4 border-black bg-white px-6 py-4 font-black uppercase placeholder-zinc-400 outline-none focus:bg-yellow-100 transition-colors md:min-w-[400px]" 
            />
            <button 
              type="submit"
              className="neo-pop-hover bg-black px-10 py-4 font-black uppercase text-white shadow-[4px_4px_0px_0px_#ea7e2a]"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </SectionContainer>
    </main>
  );
}
