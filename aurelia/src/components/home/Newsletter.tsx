'use client';

import { useState, type FormEvent } from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'done'>('idle');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In production this posts to /api/subscribe (Klaviyo, Mailchimp, etc.)
    setStatus('done');
  }

  return (
    <section className="pt-section">
      <Container>
        <Reveal className="relative overflow-hidden bg-champagne px-6 py-20 text-center md:px-16">
          <p className="eyebrow mb-3">Join the list</p>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl leading-tight text-ink md:text-5xl text-balance">
            Ten percent, and a first look at everything new.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-graphite/75">
            Subscribe for a private welcome offer and the occasional letter from the atelier.
            No noise — only the things worth telling you.
          </p>

          {status === 'done' ? (
            <p className="mx-auto mt-8 max-w-md font-serif text-2xl text-ink">
              Welcome to AURELIA. Your offer is on its way.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="hero-email" className="sr-only">Email address</label>
              <input
                id="hero-email"
                type="email"
                required
                placeholder="Email address"
                className="h-12 flex-1 border border-ink/15 bg-ivory px-5 text-sm text-ink placeholder:text-graphite/50 focus:border-ink focus:outline-none"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
