'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden bg-ink">
      <Image
        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=2000&q=80"
        alt="A model wearing AURELIA solid-gold jewelry against a warm editorial backdrop"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Editorial scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/30" />

      <div className="absolute inset-0 mx-auto flex max-w-edge flex-col justify-end px-6 pb-20 md:px-10 md:pb-24 lg:px-16">
        <motion.p
          className="eyebrow text-gold-soft"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          The 2026 Collection
        </motion.p>
        <motion.h1
          className="mt-4 max-w-4xl font-serif text-hero text-ivory text-balance"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.08 }}
        >
          Gold, made to be lived in.
        </motion.h1>
        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-ivory/75"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.16 }}
        >
          Bracelets, earrings and solid 18k necklaces — hand-finished in New York
          to be worn every day and kept for a lifetime.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.24 }}
        >
          <Button href="/collections" variant="light" size="lg">Shop the Collection</Button>
          <Link href="/craftsmanship" className="text-xs uppercase tracking-luxe text-ivory link-underline">
            Our Craftsmanship
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-ivory/70 to-transparent" />
      </motion.div>
    </section>
  );
}
