import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Reveal } from '@/components/ui/Reveal';

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 3 | 4;
}) {
  const cols = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
  return (
    <div className={`grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 ${cols}`}>
      {products.map((product, i) => (
        <Reveal key={product.id} as="div" delay={(i % 4) * 0.06}>
          <ProductCard product={product} priority={i < 2} />
        </Reveal>
      ))}
    </div>
  );
}
