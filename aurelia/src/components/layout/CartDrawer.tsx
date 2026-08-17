'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreProvider';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { CloseIcon, MinusIcon, PlusIcon } from '@/components/ui/Icons';

export function CartDrawer() {
  const { isCartOpen, closeCart, cart, subtotal, setQuantity, removeFromCart, cartCount } = useStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={closeCart} />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-serif text-xl text-ink">Cart <span className="text-graphite/60">({cartCount})</span></h2>
              <button type="button" onClick={closeCart} aria-label="Close cart" className="text-ink transition-colors hover:text-gold">
                <CloseIcon />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="font-serif text-2xl text-ink">Your cart is empty</p>
                <p className="max-w-xs text-sm text-graphite/70">
                  Discover pieces made to be worn every day and kept for a lifetime.
                </p>
                <Button href="/collections" onClick={closeCart} variant="outline">
                  Explore Collections
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {cart.map((line) => {
                    const product = getProductById(line.productId);
                    if (!product) return null;
                    return (
                      <li key={line.productId} className="flex gap-4 py-5">
                        <Link href={`/product/${product.slug}`} onClick={closeCart} className="relative h-24 w-20 shrink-0 overflow-hidden bg-champagne">
                          <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="80px" className="object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <h3 className="font-serif text-base text-ink">{product.name}</h3>
                            <button type="button" onClick={() => removeFromCart(line.productId)} aria-label={`Remove ${product.name}`} className="text-graphite/50 transition-colors hover:text-ink">
                              <CloseIcon width={16} height={16} />
                            </button>
                          </div>
                          <p className="mt-1 text-xs uppercase tracking-wide text-graphite/60">{product.materials[0]}</p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center border border-line">
                              <button type="button" onClick={() => setQuantity(line.productId, line.quantity - 1)} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center text-ink hover:text-gold">
                                <MinusIcon width={14} height={14} />
                              </button>
                              <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                              <button type="button" onClick={() => setQuantity(line.productId, line.quantity + 1)} aria-label="Increase quantity" className="grid h-8 w-8 place-items-center text-ink hover:text-gold">
                                <PlusIcon width={14} height={14} />
                              </button>
                            </div>
                            <p className="text-sm text-charcoal">{formatPrice(product.price * line.quantity, product.currency)}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-line px-6 py-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm uppercase tracking-luxe text-graphite">Subtotal</span>
                    <span className="font-serif text-xl text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-5 text-xs text-graphite/60">Shipping & taxes calculated at checkout.</p>
                  <div className="flex flex-col gap-3">
                    <Button href="/checkout" onClick={closeCart} className="w-full">Proceed to Checkout</Button>
                    <Button href="/cart" onClick={closeCart} variant="ghost" className="w-full">View Cart</Button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
