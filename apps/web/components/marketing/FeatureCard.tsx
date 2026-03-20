import * as Icons from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Icons;
  colorClass?: string;
}

export const FeatureCard = ({ title, description, iconName, colorClass = '' }: FeatureCardProps) => {
  const Icon = (Icons[iconName] as Icons.LucideIcon) || Icons.HelpCircle;

  return (
    <div className="marketing-card group flex h-full flex-col p-6 sm:p-7">
      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 shadow-lg transition-transform duration-300 group-hover:scale-105 ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h3>
      <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-300">{description}</p>
      <div className="mt-5 text-sm font-medium text-purple-300 transition-colors group-hover:text-purple-200">
        Built for shared spending
      </div>
    </div>
  );
};
