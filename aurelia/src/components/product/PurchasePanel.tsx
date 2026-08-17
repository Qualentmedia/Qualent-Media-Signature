'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/context/StoreProvider';
import { Button } from '@/components/ui/Button';
import { Accordion } from './Accordion';
import { HeartIcon, StarIcon, MinusIcon, PlusIcon } from '@/components/ui/Icons';

export function PurchasePanel({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const wished = isWishlisted(product.id);

  return (
    <div className="lg:sticky lg:top-28">
      <p className="eyebrow">{product.category.replace('-', ' ')}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">{product.name}</h1>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1 text-gold" aria-label={`Rated ${product.rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < Math.round(product.rating)} />
          ))}
        </div>
        <span className="text-xs text-graphite/60">{product.rating} · {product.reviewCount} reviews</span>
      </div>

      <p className="mt-6 font-sans text-2xl text-ink">{formatPrice(product.price, product.currency)}</p>
      <p className="mt-5 max-w-md text-base leading-relaxed text-graphite/80">{product.description}</p>

      {/* Quantity + actions */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center border border-line">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid h-12 w-12 place-items-center text-ink hover:text-gold">
            <MinusIcon width={15} height={15} />
          </button>
          <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="grid h-12 w-12 place-items-center text-ink hover:text-gold">
            <PlusIcon width={15} height={15} />
          </button>
        </div>
        <Button onClick={() => addToCart(product.id, qty)} size="lg" className="flex-1">
          Add to Cart
        </Button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="grid h-14 w-14 shrink-0 place-items-center border border-ink/20 text-ink transition-colors hover:border-ink hover:text-gold"
        >
          <HeartIcon filled={wished} />
        </button>
      </div>

      <p className="mt-4 text-xs uppercase tracking-luxe text-graphite/60">
        Complimentary insured shipping · Lifetime guarantee
      </p>

      {/* Details */}
      <div className="mt-10">
        <Accordion
          items={[
            {
              title: 'Materials',
              content: (
                <ul className="space-y-2">
                  {product.materials.map((m) => (
                    <li key={m}>— {m}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: 'Details & Dimensions',
              content: (
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
              ),
            },
            { title: 'Size Guide', content: <p>Not sure of your size? Our client team offers a complimentary virtual fitting. Most bracelets are adjustable; necklaces list their length range above. <a href="/contact" className="text-ink link-underline">Contact the atelier</a>.</p> },
            { title: 'Care', content: <p>{product.care}</p> },
            { title: 'Shipping & Returns', content: <p>Every order ships fully insured and carbon-neutral within 2–4 business days, in signature packaging. Returns and exchanges are complimentary within 30 days. <a href="/faq#shipping" className="text-ink link-underline">Full policy</a>.</p> },
          ]}
        />
      </div>
    </div>
  );
}
