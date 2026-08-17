'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/context/StoreProvider';
import { HeartIcon } from '@/components/ui/Icons';
import { QuickView } from './QuickView';

/**
 * Luxury product card:
 *  - large premium image with a second-image cross-fade on hover
 *  - quiet wishlist toggle, top-right
 *  - "Quick View" reveal on hover (keyboard reachable)
 *  - generous spacing, hairline price row
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const [quickOpen, setQuickOpen] = useState(false);
  const wished = isWishlisted(product.id);
  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];

  return (
    <article className="group relative">
      <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-champagne">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="block h-full w-full">
          {/* Base image */}
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-opacity duration-700 ease-luxe group-hover:opacity-0"
          />
          {/* Hover image */}
          <Image
            src={secondary.src}
            alt=""
            fill
            aria-hidden
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-4 top-4 bg-ivory/90 px-3 py-1 text-[0.6rem] uppercase tracking-luxe text-ink backdrop-blur">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ivory/85 text-ink backdrop-blur transition-colors hover:text-gold"
        >
          <HeartIcon filled={wished} width={17} height={17} />
        </button>

        {/* Quick view — slides up on hover, always keyboard focusable */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 ease-luxe group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="h-11 w-full bg-ink/90 font-sans text-[0.68rem] uppercase tracking-luxe text-ivory backdrop-blur transition-colors hover:bg-gold hover:text-ink"
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg leading-tight text-ink">
            <Link href={`/product/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wide2 text-graphite/70">
            {product.materials[0]}
          </p>
        </div>
        <p className="whitespace-nowrap font-sans text-sm text-charcoal">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>

      {quickOpen && <QuickView product={product} onClose={() => setQuickOpen(false)} />}
    </article>
  );
}
