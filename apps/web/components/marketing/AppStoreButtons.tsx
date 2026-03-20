import { Apple, PlayCircle } from 'lucide-react';

export const AppStoreButtons = () => {
  return (
    <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
      <button disabled className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-left text-zinc-400 opacity-80">
        <Apple size={22} />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em]">Coming soon</div>
          <div className="text-base font-semibold leading-none text-white">App Store</div>
        </div>
      </button>

      <button disabled className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-left text-zinc-400 opacity-80">
        <PlayCircle size={22} />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em]">Coming soon</div>
          <div className="text-base font-semibold leading-none text-white">Google Play</div>
        </div>
      </button>
    </div>
  );
};
