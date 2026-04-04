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
  compact: 'py-12 sm:py-16 lg:py-20',
  default: 'py-16 sm:py-24 lg:py-28',
  spacious: 'py-20 sm:py-28 lg:py-36',
  full: 'min-h-screen flex flex-col justify-center py-16 sm:py-20',
};

export function SectionContainer({
  children,
  className = '',
  id,
  size = 'default',
}: SectionContainerProps) {
  return (
    <section id={id} className={`relative w-full ${sizeClasses[size]} ${className}`}>
      <div className="mx-auto w-full max-w-[var(--fs-content-max-width)] px-[var(--fs-section-inline)] md:px-8 xl:px-[var(--fs-section-inline-wide)]">
        {children}
      </div>
    </section>
  );
}
