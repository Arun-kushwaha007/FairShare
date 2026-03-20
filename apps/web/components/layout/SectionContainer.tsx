import { ReactNode } from 'react';

type SectionSize = 'none' | 'compact' | 'default' | 'spacious' | 'full';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  size?: SectionSize;
}

const sizeClasses: Record<SectionSize, string> = {
  none: 'py-0',
  compact: 'py-12 sm:py-20',
  default: 'py-20 sm:py-32',
  spacious: 'py-32 sm:py-48',
  full: 'min-h-screen flex flex-col justify-center py-20',
};

export function SectionContainer({
  children,
  className = '',
  id,
  size = 'default',
}: SectionContainerProps) {
  return (
    <section id={id} className={`relative w-full ${sizeClasses[size]} ${className}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
