import { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  centered = false,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <span className="eyebrow-label mb-6">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className={`mt-6 text-lg leading-8 text-zinc-400 ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
      {children && <div className={`mt-8 ${centered ? 'flex justify-center' : ''}`}>{children}</div>}
    </div>
  );
}
