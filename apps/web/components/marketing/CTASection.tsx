import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export const CTASection = ({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CTASectionProps) => {
  return (
    <div className="marketing-card relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_30%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        {eyebrow ? <div className="mb-4 flex justify-center"><span className="eyebrow-label">{eyebrow}</span></div> : null}
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={primaryHref} className="btn-royal inline-flex items-center gap-2">
            {primaryLabel}
            <ArrowRight size={16} />
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="btn-secondary">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};
