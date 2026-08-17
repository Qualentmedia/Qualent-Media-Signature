import Link from 'next/link';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-2 font-sans uppercase tracking-luxe text-[0.7rem] transition-colors duration-500 ease-luxe disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Black with gold hover — the house button.
  primary: 'bg-ink text-ivory hover:bg-gold hover:text-ink',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory',
  ghost: 'text-ink hover:text-gold',
  // For use on dark sections.
  light: 'bg-ivory text-ink hover:bg-gold hover:text-ink',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-6',
  md: 'h-12 px-8',
  lg: 'h-14 px-10',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export const Button = forwardRef<HTMLButtonElement, ButtonAsButton | ButtonAsLink>(
  function Button({ variant = 'primary', size = 'md', className, children, ...props }, ref) {
    const classes = cn(base, variants[variant], sizes[size], className);

    if ('href' in props && props.href) {
      const { href, ...linkProps } = props as ButtonAsLink;
      return (
        <Link href={href} className={classes} {...linkProps}>
          {children}
        </Link>
      );
    }

    const btnProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button ref={ref} className={classes} {...btnProps}>
        {children}
      </button>
    );
  },
);
