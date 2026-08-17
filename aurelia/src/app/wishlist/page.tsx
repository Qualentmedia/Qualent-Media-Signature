'use client';

import { useStore } from '@/context/StoreProvider';
import { getProductById } from '@/lib/products';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const products = wishlist.map(getProductById).filter(Boolean);

  return (
    <Container className="min-h-[60vh] pb-section pt-16 md:pt-24">
      <header className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4">Saved</p>
        <h1 className="font-serif text-5xl text-ink md:text-6xl">Your wishlist</h1>
        <p className="mt-5 text-base text-graphite/80">
          The pieces you are considering, kept in one place. They will be waiting whenever you return.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-start gap-6 border-t border-line pt-14">
          <p className="font-serif text-3xl text-ink">Nothing saved yet.</p>
          <p className="max-w-md text-sm text-graphite/70">
            Tap the heart on any piece to save it here for later.
          </p>
          <Button href="/collections" variant="outline">Explore Collections</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
          {products.map((p) => p && <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </Container>
  );
}
