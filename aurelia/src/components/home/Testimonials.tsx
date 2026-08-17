'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { StarIcon } from '@/components/ui/Icons';

const testimonials = [
  {
    quote:
      'I have bought fine jewelry from the grand houses. Nothing has felt as personal, or as quietly perfect, as my AURELIA necklace.',
    author: 'Élodie M.',
    role: 'Collector, Paris',
  },
  {
    quote:
      'The weight, the finish, the box it arrives in — every detail says this was made by people who care. It has become my signature.',
    author: 'Sarah K.',
    role: 'Client since 2024, London',
  },
  {
    quote:
      'Three years of daily wear and my bracelet looks the day I bought it. That is the whole point of solid gold, and they deliver it.',
    author: 'Priya N.',
    role: 'Client, New York',
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];

  return (
    <section className="bg-ink py-section text-ivory">
      <Container className="text-center">
        <div className="mx-auto mb-8 flex items-center justify-center gap-2 text-gold">
          {Array.from({ length: 5 }).map((_, s) => (
            <StarIcon key={s} filled width={16} height={16} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl"
          >
            <p className="font-serif text-3xl leading-snug text-ivory md:text-4xl text-balance">
              “{t.quote}”
            </p>
            <footer className="mt-8 text-xs uppercase tracking-luxe text-ivory/60">
              {t.author} — {t.role}
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-center gap-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show testimonial ${idx + 1}`}
              aria-current={idx === i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === i ? 'w-8 bg-gold' : 'w-1.5 bg-ivory/30 hover:bg-ivory/50'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
