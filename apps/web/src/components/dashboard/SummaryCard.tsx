import { ReactNode } from 'react';

export function SummaryCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: ReactNode;
  hint?: ReactNode;
}) {

  return (
    <div className="neo-border bg-black p-6 shadow-[4px_4px_0px_0px_#22d3ee] flex flex-col justify-between">
      <div>
        <p className="text-xs font-mono font-black uppercase tracking-widest text-zinc-500 mb-1">{title}</p>
        <div className="text-4xl font-black italic tracking-tighter text-white">{value}</div>
      </div>
      {hint ? (
        <div className="mt-4 pt-4 border-t border-zinc-900 text-[10px] font-mono font-bold uppercase tracking-tighter text-zinc-400">
          DATA_LOG // {hint}
        </div>
      ) : null}
    </div>
  );
}


