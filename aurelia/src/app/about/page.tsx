import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'AURELIA is a modern maison of fine jewelry, founded in New York on a single belief: that gold should be lived in, not locked away.',
  alternates: { canonical: '/about' },
};

const stats = [
  { value: '2019', label: 'Founded in SoHo' },
  { value: '100%', label: 'Recycled 18k gold' },
  { value: '1', label: 'Maker per piece' },
  { value: '∞', label: 'Lifetime guarantee' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Maison"
        title="Gold should be lived in, not locked away."
        description="AURELIA was founded on a quiet rebellion against jewelry made to be admired and never worn. We make solid, everyday fine gold — pieces you put on and forget you are wearing, until someone notices."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <Container className="pt-16">
        <Reveal className="img-zoom relative aspect-[16/9] overflow-hidden bg-champagne">
          <Image
            src="https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=2000&q=80"
            alt="The AURELIA atelier in SoHo, New York"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>
      </Container>

      <Container className="pt-section">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Our story</p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl text-balance">
              Begun at a single bench
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-base leading-relaxed text-graphite/80">
            <p>
              AURELIA began in 2019 with one goldsmith, one bench, and a frustration with
              fine jewelry that lived in a safe. We wanted the opposite — solid gold designed
              for a Tuesday, priced honestly, and made to last several lifetimes.
            </p>
            <p>
              Today we are a small studio on Greene Street. We still make in small runs, still
              finish every piece by hand, and still answer our own emails. We use only recycled
              18-karat gold and traceable, conflict-free stones. Nothing is plated. Nothing is hollow.
            </p>
            <p>
              What has not changed is the belief we started with: the most luxurious thing a
              piece of jewelry can do is disappear into your life and stay there.
            </p>
            <div className="pt-4">
              <Button href="/craftsmanship" variant="outline">See how it is made</Button>
            </div>
          </Reveal>
        </div>
      </Container>

      <Container className="pt-section">
        <div className="grid grid-cols-2 gap-8 border-y border-line py-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} as="div" delay={(i % 4) * 0.06} className="text-center">
              <p className="font-serif text-5xl text-gold md:text-6xl">{s.value}</p>
              <p className="mt-3 text-xs uppercase tracking-luxe text-graphite/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
