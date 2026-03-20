import { SectionContainer } from '../layout/SectionContainer';
import { GlassCard } from '../ui/GlassCard';

const stats = [
  { label: 'Active Groups', value: '12,000+' },
  { label: 'Expenses Split', value: '$2.5M+' },
  { label: 'User Rating', value: '4.9/5' },
  { label: 'Time Saved', value: '250k hrs' },
];

export function TrustStatsSection() {
  return (
    <SectionContainer size="compact">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="group overflow-hidden">
            <div className="p-8 text-center">
              <p className="text-4xl font-extrabold tracking-tight text-white group-hover:text-purple-400 transition-colors">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {stat.label}
              </p>
            </div>
            {/* Minimal Background Accent */}
            <div className="absolute top-0 right-0 h-20 w-20 bg-purple-500/5 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </GlassCard>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Trusted by groups from these companies & more
        </p>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale filter hover:grayscale-0 hover:opacity-60 transition-all duration-500">
          {/* Company Logo Placeholders */}
          <div className="text-2xl font-black text-white italic tracking-tighter">Airbnb</div>
          <div className="text-2xl font-black text-white italic tracking-tighter">Slack</div>
          <div className="text-2xl font-black text-white italic tracking-tighter">Uber</div>
          <div className="text-2xl font-black text-white italic tracking-tighter">Spotify</div>
          <div className="text-2xl font-black text-white italic tracking-tighter">Notion</div>
        </div>
      </div>
    </SectionContainer>
  );
}
