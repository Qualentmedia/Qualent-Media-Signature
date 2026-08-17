import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/products';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { CollectionBrowser } from '@/components/product/CollectionBrowser';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'The full AURELIA collection — bracelets, earrings and solid 18k gold necklaces, hand-finished in New York.',
  alternates: { canonical: '/collections' },
};

export default function CollectionsPage() {
  const products = getAllProducts();
  return (
    <>
      <PageHeader
        eyebrow="The Collection"
        title="Everything, in one place"
        description="Browse the full maison. Filter by category, sort by what matters to you, and add the pieces you love to your wishlist."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Collections' }]}
      />
      <Container className="pb-section pt-16">
        <CollectionBrowser products={products} />
      </Container>
    </>
  );
}
