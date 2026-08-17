import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowIcon } from '@/components/ui/Icons';

/** Shared editorial section header: eyebrow, serif title, optional link. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = 'View all',
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <Reveal
      className={`mb-12 flex flex-col gap-4 md:mb-16 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-serif text-4xl leading-[1.05] text-ink md:text-5xl lg:text-6xl text-balance">
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-base leading-relaxed text-graphite/80 ${centered ? 'mx-auto' : ''} max-w-xl`}>
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-luxe text-ink"
        >
          <span className="link-underline">{linkLabel}</span>
          <ArrowIcon className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" width={16} height={16} />
        </Link>
      )}
    </Reveal>
  );
}
