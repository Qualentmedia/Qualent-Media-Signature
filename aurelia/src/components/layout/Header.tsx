'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { primaryNav, site } from '@/lib/site';
import { useStore } from '@/context/StoreProvider';
import { cn } from '@/lib/utils';
import { BagIcon, HeartIcon, MenuIcon, CloseIcon, SearchIcon } from '@/components/ui/Icons';

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, openCart } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500 ease-luxe',
        scrolled ? 'bg-ivory/85 backdrop-blur-md shadow-[0_1px_0_rgba(15,15,15,0.06)]' : 'bg-ivory',
      )}
    >
      <div className="mx-auto flex h-16 max-w-edge items-center justify-between px-6 md:h-20 md:px-10 lg:px-16">
        {/* Left: mobile menu + desktop nav */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {primaryNav.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'link-underline text-[0.72rem] uppercase tracking-luxe text-charcoal transition-colors hover:text-ink',
                  pathname === item.href && 'text-ink',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.3em] text-ink md:text-[1.7rem]"
          aria-label={`${site.name} home`}
        >
          {site.name}
        </Link>

        {/* Right: utilities */}
        <div className="flex items-center gap-5">
          <nav aria-label="Secondary" className="hidden items-center gap-7 lg:flex">
            {primaryNav.slice(4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline text-[0.72rem] uppercase tracking-luxe text-charcoal transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/collections" aria-label="Search" className="hidden text-ink transition-colors hover:text-gold md:block">
            <SearchIcon />
          </Link>
          <Link href="/wishlist" aria-label={`Wishlist, ${wishlistCount} items`} className="relative text-ink transition-colors hover:text-gold">
            <HeartIcon />
            {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
          </Link>
          <button type="button" onClick={openCart} aria-label={`Cart, ${cartCount} items`} className="relative text-ink transition-colors hover:text-gold">
            <BagIcon />
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
            <motion.nav
              aria-label="Mobile"
              className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-ivory p-8"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-serif text-xl tracking-[0.3em] text-ink">{site.name}</span>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <CloseIcon />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {primaryNav.map((item) => (
                  <Link key={item.href} href={item.href} className="font-serif text-2xl text-ink">
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6 text-xs uppercase tracking-luxe text-graphite">
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/faq">FAQ</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.55rem] font-medium text-ink">
      {children}
    </span>
  );
}
