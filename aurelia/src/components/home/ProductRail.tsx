import type { Product } from '@/lib/types';
import { Container } from '@/components/ui/Container';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionHeading } from './SectionHeading';

/** A titled product row used for Best Sellers and New Arrivals on the home page. */
export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  href,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
  href?: string;
  dark?: boolean;
}) {
  return (
    <section className={dark ? 'bg-ink py-section text-ivory' : 'pt-section'}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} href={href} />
        <ProductGrid products={products.slice(0, 4)} columns={4} />
      </Container>
    </section>
  );
}
