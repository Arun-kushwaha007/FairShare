import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AccentButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function AccentButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  icon,
  type = 'button',
  disabled,
}: AccentButtonProps) {
  const baseClasses = "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-bold transition-all active:scale-95";
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
  };

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && <span className="relative z-10 transition-transform group-hover:translate-x-0.5">{icon}</span>}
      {variant === 'primary' && (
        <div className="absolute inset-x-0 top-0 h-px bg-white/50 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick} 
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      {content}
    </button>
  );
}
