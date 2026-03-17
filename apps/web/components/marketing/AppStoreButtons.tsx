import { Apple, PlayCircle } from 'lucide-react';

export const AppStoreButtons = () => {
  return (
    <div className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
      <button
        disabled
        className="group relative flex items-center gap-3 border-4 border-white bg-zinc-900 px-8 py-4 font-black uppercase tracking-widest text-zinc-500 transition-all cursor-not-allowed opacity-70"
      >
        <Apple size={24} />
        <div className="text-left">
          <div className="text-[10px]">COMING SOON</div>
          <div className="text-lg leading-none">App Store</div>
        </div>
      </button>

      <button
        disabled
        className="group relative flex items-center gap-3 border-4 border-white bg-zinc-900 px-8 py-4 font-black uppercase tracking-widest text-zinc-500 transition-all cursor-not-allowed opacity-70"
      >
        <PlayCircle size={24} />
        <div className="text-left">
          <div className="text-[10px]">COMING SOON</div>
          <div className="text-lg leading-none">Google Play</div>
        </div>
      </button>
    </div>
  );
};
