import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

export interface Crumb {
  label: string;
  href?: string;
}

/** Editorial interior-page header with optional breadcrumbs. */
export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <Container className="pt-14 md:pt-20">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-luxe text-graphite/60">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-ink">{c.label}</Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span className="text-graphite/30">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <Reveal className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="font-serif text-5xl leading-[1.02] text-ink md:text-6xl lg:text-7xl text-balance">
          {title}
        </h1>
        {description && (
          <p className={`mt-6 text-base leading-relaxed text-graphite/80 md:text-lg ${centered ? 'mx-auto' : ''} max-w-2xl`}>
            {description}
          </p>
        )}
      </Reveal>
    </Container>
  );
}
