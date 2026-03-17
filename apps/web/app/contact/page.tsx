import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { Mail, MessageSquare, Twitter, Instagram, Github } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | FairShare – Hit Us Up',
  description: 'Whether you have a bug report or just want to say hi, our squad is standing by.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />

      <SectionContainer className="pt-44 text-center">
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-black tracking-widest text-purple-400 uppercase">
            Support Protocol
          </div>
        </div>
        <h1 className="hero-title mb-6 text-6xl font-black italic tracking-tighter md:text-8xl lg:text-[7rem] leading-none uppercase">
          CON <br className="md:hidden" /> <span className="text-purple-600">NECT.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-bold uppercase tracking-widest text-zinc-500">
          WE ARE HERE TO HELP. NO BOT RESPONSES. DIRECT CHANNELS ONLY.
        </p>
      </SectionContainer>

      <SectionContainer className="pb-32">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="mb-6 text-4xl font-black uppercase italic tracking-tighter text-white">
                HIT US UP.
              </h2>
              <p className="max-w-md text-lg font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
                WHETHER YOU HAVE A BUG REPORT, A FEATURE REQUEST, OR JUST WANT TO SAY HI, OUR SQUAD IS STANDING BY.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="mailto:support@fairsharee.com"
                className="glass-card flex items-center gap-8 p-8 transition-all hover:bg-white/[0.03] group"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl group-hover:scale-110 transition-transform">
                  <Mail size={28} className="text-purple-500" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">EMAIL PROTOCOL</div>
                  <div className="text-xl font-black italic tracking-tight text-white uppercase group-hover:text-purple-400">SUPPORT@FAIRSHAREE.COM</div>
                </div>
              </a>

              <div className="glass-card flex items-center gap-8 p-8 transition-all hover:bg-white/[0.03] group opacity-70">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/5">
                  <MessageSquare size={28} className="text-zinc-700" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-1">LIVE DISPATCH</div>
                  <div className="text-xl font-black italic tracking-tight text-zinc-600 uppercase">COMING SOON</div>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Github, label: 'Github' }
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all shadow-xl"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
            <h2 className="relative mb-10 text-3xl font-black uppercase italic tracking-tighter text-white">
              DISPATCH MESSAGE.
            </h2>
            <form className="relative space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">SQUAD IDENTITY</label>
                <input
                  type="text"
                  placeholder="NAME"
                  className="w-full border border-white/10 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase text-white placeholder-zinc-800 outline-none focus:bg-white/10 transition-all text-sm tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">RETURN FREQUENCY</label>
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="w-full border border-white/10 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase text-white placeholder-zinc-800 outline-none focus:bg-white/10 transition-all text-sm tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">TRANSMISSION CONTENT</label>
                <textarea
                  rows={4}
                  placeholder="START TYPING..."
                  className="w-full border border-white/10 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase text-white placeholder-zinc-800 outline-none focus:bg-white/10 transition-all text-sm tracking-widest"
                />
              </div>
              <button
                type="submit"
                className="w-full py-6 bg-purple-600 text-white text-xl font-black italic tracking-tighter uppercase rounded-2xl shadow-2xl shadow-purple-900/40 hover:scale-[1.02] transition-all"
              >
                SEND SIGNAL
              </button>
            </form>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
}
