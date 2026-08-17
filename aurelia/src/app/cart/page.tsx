'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreProvider';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CloseIcon, MinusIcon, PlusIcon } from '@/components/ui/Icons';

export default function CartPage() {
  const { cart, subtotal, setQuantity, removeFromCart } = useStore();

  return (
    <Container className="min-h-[60vh] pb-section pt-16 md:pt-24">
      <header className="mb-14">
        <p className="eyebrow mb-4">Cart</p>
        <h1 className="font-serif text-5xl text-ink md:text-6xl">Your selection</h1>
      </header>

      {cart.length === 0 ? (
        <div className="flex flex-col items-start gap-6 border-t border-line pt-14">
          <p className="font-serif text-3xl text-ink">Your cart is empty.</p>
          <Button href="/collections" variant="outline">Explore Collections</Button>
        </div>
      ) : (
        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-24">
          {/* Lines */}
          <ul className="divide-y divide-line border-y border-line">
            {cart.map((line) => {
              const product = getProductById(line.productId);
              if (!product) return null;
              return (
                <li key={line.productId} className="flex gap-6 py-8">
                  <Link href={`/product/${product.slug}`} className="relative h-36 w-28 shrink-0 overflow-hidden bg-champagne">
                    <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl text-ink">
                          <Link href={`/product/${product.slug}`} className="link-underline">{product.name}</Link>
                        </h2>
                        <p className="mt-1 text-xs uppercase tracking-wide2 text-graphite/60">{product.materials[0]}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(line.productId)} aria-label={`Remove ${product.name}`} className="text-graphite/50 transition-colors hover:text-ink">
                        <CloseIcon />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-6">
                      <div className="flex items-center border border-line">
                        <button type="button" onClick={() => setQuantity(line.productId, line.quantity - 1)} aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center text-ink hover:text-gold">
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button type="button" onClick={() => setQuantity(line.productId, line.quantity + 1)} aria-label="Increase quantity" className="grid h-10 w-10 place-items-center text-ink hover:text-gold">
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                      <p className="font-serif text-xl text-ink">{formatPrice(product.price * line.quantity, product.currency)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-line p-8">
              <h2 className="font-serif text-2xl text-ink">Order summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-graphite/70">Subtotal</dt>
                  <dd className="text-ink">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-graphite/70">Shipping</dt>
                  <dd className="text-ink">Complimentary</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-graphite/70">Estimated tax</dt>
                  <dd className="text-graphite/60">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
                <span className="text-xs uppercase tracking-luxe text-graphite">Total</span>
                <span className="font-serif text-2xl text-ink">{formatPrice(subtotal)}</span>
              </div>
              <Button href="/checkout" className="mt-8 w-full">Proceed to Checkout</Button>
              <p className="mt-4 text-center text-xs text-graphite/60">Insured worldwide shipping · 30-day returns</p>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
