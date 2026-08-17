import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { journalPosts } from '@/lib/journal';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes from the atelier — on craft, style, and the quiet luxury of solid gold.',
  alternates: { canonical: '/journal' },
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function JournalPage() {
  const [lead, ...rest] = journalPosts;

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Notes from the atelier"
        description="On craft, on style, and on the small decisions that make a piece worth keeping."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Journal' }]}
      />

      <Container className="pt-16">
        {/* Lead article */}
        <Reveal>
          <Link href={`/journal/${lead.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-champagne">
              <Image
                src={`https://images.unsplash.com/${lead.image}?auto=format&fit=crop&w=1400&q=80`}
                alt={lead.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[0.68rem] uppercase tracking-luxe text-gold">
                {lead.category} · {lead.readTime}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl text-balance">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-graphite/80">{lead.excerpt}</p>
              <p className="mt-6 text-xs uppercase tracking-luxe text-graphite/50">{fmt(lead.date)}</p>
            </div>
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="mt-24 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} as="article" delay={(i % 3) * 0.08}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-champagne">
                  <Image
                    src={`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1000&q=80`}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-5 text-[0.68rem] uppercase tracking-luxe text-gold">
                  {post.category} · {post.readTime}
                </p>
                <h3 className="mt-3 font-serif text-2xl leading-snug text-ink">
                  <span className="link-underline">{post.title}</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite/75">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
