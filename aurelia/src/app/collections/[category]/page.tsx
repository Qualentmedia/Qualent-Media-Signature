import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { categories, getCategory, getProductsByCategory } from '@/lib/products';
import { Container } from '@/components/ui/Container';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

interface Params {
  params: { category: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const category = getCategory(params.category);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/collections/${category.slug}` },
    openGraph: {
      title: `${category.title} — AURELIA`,
      description: category.description,
      images: [{ url: category.image }],
    },
  };
}

export default function CategoryPage({ params }: Params) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/collections' },
          { name: category.name, url: `/collections/${category.slug}` },
        ]}
      />

      {/* Category hero */}
      <section className="relative h-[52vh] min-h-[380px] w-full overflow-hidden bg-ink">
        <Image
          src={category.image}
          alt={`${category.name} collection`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-ink/20" />
        <Container className="absolute inset-0 flex flex-col justify-end pb-14">
          <Reveal>
            <p className="eyebrow text-gold-soft">{category.tagline}</p>
            <h1 className="mt-3 font-serif text-6xl text-ivory md:text-7xl">{category.name}</h1>
          </Reveal>
        </Container>
      </section>

      <PageHeader
        title={category.title}
        description={category.description}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: category.name },
        ]}
      />

      <Container className="pb-section pt-16">
        <p className="mb-8 text-xs uppercase tracking-luxe text-graphite/50">{products.length} pieces</p>
        <ProductGrid products={products} columns={4} />
      </Container>
    </>
  );
}
