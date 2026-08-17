'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreProvider';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/site';

const input =
  'h-12 w-full border border-ink/15 bg-ivory px-4 text-sm text-ink placeholder:text-graphite/45 transition-colors focus:border-ink focus:outline-none';
const label = 'mb-2 block text-[0.68rem] uppercase tracking-luxe text-graphite';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useStore();
  const [placed, setPlaced] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Production: hand off to Stripe / Shopify Checkout / commerce provider.
    clearCart();
    setPlaced(true);
  }

  if (placed) {
    return (
      <Container className="grid min-h-[70vh] place-items-center py-section text-center">
        <div className="max-w-lg">
          <p className="eyebrow mb-4">Order confirmed</p>
          <h1 className="font-serif text-5xl text-ink md:text-6xl">Thank you.</h1>
          <p className="mx-auto mt-6 text-base text-graphite/80">
            A confirmation is on its way to your inbox. Each piece is now being prepared and
            hand-checked at our atelier before it ships, fully insured, to your door.
          </p>
          <Button href="/collections" variant="outline" className="mt-10">Continue exploring</Button>
        </div>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="grid min-h-[60vh] place-items-center py-section text-center">
        <div>
          <h1 className="font-serif text-4xl text-ink">Your cart is empty</h1>
          <p className="mt-4 text-sm text-graphite/70">Add a piece before proceeding to checkout.</p>
          <Button href="/collections" variant="outline" className="mt-8">Explore Collections</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-section pt-12 md:pt-16">
      <div className="mb-12 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-[0.3em] text-ink">{site.name}</Link>
        <Link href="/cart" className="text-xs uppercase tracking-luxe text-graphite link-underline">Back to cart</Link>
      </div>

      <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-12">
          <fieldset>
            <legend className="mb-6 font-serif text-2xl text-ink">Contact</legend>
            <label htmlFor="ce" className={label}>Email</label>
            <input id="ce" type="email" required autoComplete="email" className={input} placeholder="you@email.com" />
          </fieldset>

          <fieldset>
            <legend className="mb-6 font-serif text-2xl text-ink">Shipping address</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="fn" className={label}>First name</label><input id="fn" required autoComplete="given-name" className={input} /></div>
              <div><label htmlFor="ln" className={label}>Last name</label><input id="ln" required autoComplete="family-name" className={input} /></div>
              <div className="sm:col-span-2"><label htmlFor="ad" className={label}>Address</label><input id="ad" required autoComplete="street-address" className={input} /></div>
              <div><label htmlFor="ci" className={label}>City</label><input id="ci" required autoComplete="address-level2" className={input} /></div>
              <div><label htmlFor="zi" className={label}>Postal code</label><input id="zi" required autoComplete="postal-code" className={input} /></div>
              <div className="sm:col-span-2"><label htmlFor="co" className={label}>Country</label>
                <select id="co" className={input} defaultValue="United States">
                  <option>United States</option><option>United Kingdom</option><option>France</option><option>Canada</option><option>Australia</option><option>Other</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-6 font-serif text-2xl text-ink">Payment</legend>
            <p className="mb-5 text-xs text-graphite/60">Demo checkout — no card is charged. In production this is a secure Stripe / Shopify field.</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><label htmlFor="cc" className={label}>Card number</label><input id="cc" inputMode="numeric" placeholder="•••• •••• •••• ••••" className={input} /></div>
              <div><label htmlFor="ex" className={label}>Expiry</label><input id="ex" placeholder="MM / YY" className={input} /></div>
              <div><label htmlFor="cv" className={label}>CVC</label><input id="cv" placeholder="•••" className={input} /></div>
            </div>
          </fieldset>

          <Button type="submit" size="lg" className="w-full">Place order · {formatPrice(subtotal)}</Button>
        </form>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="bg-champagne/40 p-8">
            <h2 className="mb-6 font-serif text-2xl text-ink">Your order</h2>
            <ul className="space-y-5">
              {cart.map((line) => {
                const p = getProductById(line.productId);
                if (!p) return null;
                return (
                  <li key={line.productId} className="flex items-center gap-4">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-champagne">
                      <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="56px" className="object-cover" />
                      <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.6rem] text-ivory">{line.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-base text-ink">{p.name}</p>
                      <p className="text-xs text-graphite/60">{p.materials[0]}</p>
                    </div>
                    <p className="text-sm text-ink">{formatPrice(p.price * line.quantity, p.currency)}</p>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
              <div className="flex justify-between"><dt className="text-graphite/70">Subtotal</dt><dd className="text-ink">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-graphite/70">Shipping</dt><dd className="text-ink">Complimentary</dd></div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs uppercase tracking-luxe text-graphite">Total</span>
              <span className="font-serif text-2xl text-ink">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
