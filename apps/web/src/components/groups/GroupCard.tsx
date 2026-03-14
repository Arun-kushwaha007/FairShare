import Link from 'next/link';

interface GroupCardProps {
  id: string;
  name: string;
  currency: string;
  memberCount: number;
  balance?: {
    owe: string;
    owed: string;
  };
}

export function GroupCard({ id, name, currency, memberCount, balance }: GroupCardProps) {
  return (
    <Link
      href={`/dashboard/groups/${id}`}
      className="group block neo-border bg-zinc-900 p-6 shadow-[4px_4px_0px_0px_#22d3ee] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5 bg-black">
              {memberCount} MEMBERS
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5 bg-black">
              CURR: {currency}
            </span>
          </div>
        </div>
        
        {balance && (
          <div className="text-right space-y-1">
            {parseFloat(balance.owed) > 0 && (
              <div className="bg-green-400/10 border border-green-500/30 px-3 py-1 text-[10px] font-mono font-bold text-green-400 uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(74,222,128,0.2)]">
                OWED // {balance.owed}
              </div>
            )}
            {parseFloat(balance.owe) > 0 && (
              <div className="bg-red-400/10 border border-red-500/30 px-3 py-1 text-[10px] font-mono font-bold text-red-400 uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(248,113,113,0.2)]">
                OWE // {balance.owe}
              </div>
            )}
            {parseFloat(balance.owed) === 0 && parseFloat(balance.owe) === 0 && (
              <div className="bg-zinc-800 border border-zinc-700 px-3 py-1 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-tighter">
                SETTLED
              </div>
            )}
          </div>
        )}
      </div>
    </Link>

  );
}
