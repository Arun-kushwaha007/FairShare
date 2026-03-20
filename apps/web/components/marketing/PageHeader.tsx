import { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}

export const PageHeader = ({
  eyebrow,
  title,
  description,
  align = 'center',
  children,
}: PageHeaderProps) => {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <div className={centered ? 'mb-5 flex justify-center' : 'mb-5'}>
          <span className="eyebrow-label">{eyebrow}</span>
        </div>
      ) : null}
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
        {description}
      </p>
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
};
