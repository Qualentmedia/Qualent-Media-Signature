import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { journalPosts, getPost } from '@/lib/journal';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/lib/site';

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: [`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1200&q=80`],
    },
  };
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function JournalArticle({ params }: Params) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { '@type': 'Organization', name: site.name },
            image: `https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1200&q=80`,
          }),
        }}
      />

      <Container className="pt-14 md:pt-20">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-[0.68rem] uppercase tracking-luxe text-graphite/60">
            <li><Link href="/" className="hover:text-ink">Home</Link></li>
            <li className="text-graphite/30">/</li>
            <li><Link href="/journal" className="hover:text-ink">Journal</Link></li>
          </ol>
        </nav>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[0.68rem] uppercase tracking-luxe text-gold">
            {post.category} · {post.readTime} · {fmt(post.date)}
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-ink md:text-6xl text-balance">
            {post.title}
          </h1>
        </Reveal>
      </Container>

      <Container className="pt-14">
        <Reveal className="img-zoom relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden bg-champagne">
          <Image
            src={`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=2000&q=80`}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>
      </Container>

      <Container className="pb-section pt-16">
        <div className="mx-auto max-w-2xl space-y-7 text-lg leading-relaxed text-charcoal/90">
          {post.body.map((para, i) => (
            <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-ink' : ''}>
              {para}
            </p>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl border-t border-line pt-8 text-center">
          <Link href="/journal" className="text-xs uppercase tracking-luxe text-ink link-underline">
            ← Back to Journal
          </Link>
        </div>
      </Container>
    </article>
  );
}
