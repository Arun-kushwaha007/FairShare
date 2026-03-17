import { Metadata } from 'next';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { Mail, MessageSquare, Twitter, Instagram, Github } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | FairShare – Hit Us Up',
  description: 'Whether you have a bug report or just want to say hi, our squad is standing by.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <SectionContainer className="pt-20 text-center">
        <h1 className="glitch-text mb-6 text-6xl font-black italic tracking-tighter md:text-8xl">
          CONNECT.
        </h1>
        <p className="mx-auto max-w-2xl text-xl font-bold uppercase tracking-widest text-zinc-400">
          WE ARE HERE TO HELP. NO BOT RESPONSES.
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
              <p className="max-w-md text-xl font-bold uppercase tracking-widest text-zinc-400 leading-relaxed">
                WHETHER YOU HAVE A BUG REPORT, A FEATURE REQUEST, OR JUST WANT TO SAY HI, OUR SQUAD IS STANDING BY.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="mailto:support@fairsharee.com"
                className="neo-border neo-pop-hover flex items-center gap-6 bg-zinc-900 p-6 transition-all hover:bg-white hover:text-black"
              >
                <div className="flex h-12 w-12 items-center justify-center border-2 border-white bg-black p-2">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">EMAIL US</div>
                  <div className="text-xl font-black italic">SUPPORT@FAIRSHAREE.COM</div>
                </div>
              </a>

              <div className="neo-border neo-pop-hover flex items-center gap-6 bg-zinc-900 p-6 transition-all hover:bg-white hover:text-black">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-white bg-black p-2">
                  <MessageSquare size={24} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">LIVE CHAT</div>
                  <div className="text-xl font-black italic underline decoration-purple-400">COMING SOON</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Github, label: 'Github' }
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="flex h-16 w-16 items-center justify-center border-4 border-white bg-black text-white hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <Icon size={28} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="neo-border neo-shadow-cyan bg-zinc-900 p-10">
            <h2 className="mb-8 text-3xl font-black uppercase italic tracking-tighter text-white">
              DISPATCH MESSAGE.
            </h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">YOUR NAME</label>
                <input
                  type="text"
                  placeholder="NAME"
                  className="w-full border-4 border-black bg-white px-6 py-4 font-black uppercase text-black placeholder-zinc-400 outline-none focus:bg-cyan-100 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">YOUR EMAIL</label>
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="w-full border-4 border-black bg-white px-6 py-4 font-black uppercase text-black placeholder-zinc-400 outline-none focus:bg-cyan-100 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">MESSAGE CONTENT</label>
                <textarea
                  rows={4}
                  placeholder="START TYPING..."
                  className="w-full border-4 border-black bg-white px-6 py-4 font-black uppercase text-black placeholder-zinc-400 outline-none focus:bg-cyan-100 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="neo-pop-hover w-full border-4 border-white bg-white py-6 text-2xl font-black uppercase text-black hover:bg-cyan-400 transition-all"
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
