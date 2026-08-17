'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/context/StoreProvider';
import { Button } from '@/components/ui/Button';
import { CloseIcon, StarIcon } from '@/components/ui/Icons';

/** Lightweight modal preview so shoppers can add to cart without leaving the grid. */
export function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
      >
        <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden bg-ivory shadow-lift md:grid-cols-2"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-ivory/80 text-ink transition-colors hover:text-gold"
          >
            <CloseIcon />
          </button>

          <div className="relative aspect-square md:aspect-auto">
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-5 p-8 md:p-10">
            <div>
              <p className="eyebrow">{product.category.replace('-', ' ')}</p>
              <h2 className="mt-2 font-serif text-3xl text-ink">{product.name}</h2>
            </div>
            <div className="flex items-center gap-2 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled={i < Math.round(product.rating)} />
              ))}
              <span className="ml-1 text-xs text-graphite/70">({product.reviewCount})</span>
            </div>
            <p className="text-sm leading-relaxed text-charcoal/80">{product.description}</p>
            <p className="font-sans text-lg text-ink">{formatPrice(product.price, product.currency)}</p>
            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={() => { addToCart(product.id); onClose(); }}>Add to Cart</Button>
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="text-center text-xs uppercase tracking-luxe text-graphite link-underline mx-auto"
              >
                View full details
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
