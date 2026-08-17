import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  getReviews,
  getCategory,
} from '@/lib/products';
import { Container } from '@/components/ui/Container';
import { ProductGallery } from '@/components/product/ProductGallery';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { Reviews } from '@/components/product/Reviews';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/home/SectionHeading';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} — AURELIA`,
      description: product.shortDescription,
      images: product.images.map((i) => ({ url: i.src, alt: i.alt })),
    },
  };
}

export default function ProductPage({ params }: Params) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategory(product.category)!;
  const related = getRelatedProducts(product);
  const reviews = getReviews(product.id);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: category.name, url: `/collections/${category.slug}` },
          { name: product.name, url: `/product/${product.slug}` },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-luxe text-graphite/60">
            <li><a href="/" className="hover:text-ink">Home</a></li>
            <li className="text-graphite/30">/</li>
            <li><a href={`/collections/${category.slug}`} className="hover:text-ink">{category.name}</a></li>
            <li className="text-graphite/30">/</li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />
          <PurchasePanel product={product} />
        </div>
      </Container>

      {/* Reviews */}
      <Container className="pt-section">
        <Reviews reviews={reviews} rating={product.rating} count={product.reviewCount} />
      </Container>

      {/* Related */}
      <Container className="pb-section pt-section">
        <SectionHeading eyebrow="You may also like" title="Complete the look" href={`/collections/${category.slug}`} />
        <ProductGrid products={related} columns={3} />
      </Container>
    </>
  );
}
