import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Our Craftsmanship',
  description:
    'Every AURELIA piece passes through a single pair of hands — cast, filed, set and polished in our SoHo atelier from recycled 18k gold.',
  alternates: { canonical: '/craftsmanship' },
};

const steps = [
  {
    n: '01',
    title: 'Sourcing',
    text: 'We begin with 100% recycled 18-karat gold and traceable, conflict-free stones — the same material, without the mine.',
    image: 'photo-1633934542430-0905ccb5f050',
  },
  {
    n: '02',
    title: 'Casting',
    text: 'Each design is hand-carved, then cast in solid gold. No plating, no filler — the gold you see is the gold throughout.',
    image: 'photo-1600003263720-95b45a4035d5',
  },
  {
    n: '03',
    title: 'Setting',
    text: 'Stones are set by hand under a loupe, one prong at a time, so each catches the light exactly as intended.',
    image: 'photo-1617038220319-276d3cfab638',
  },
  {
    n: '04',
    title: 'Finishing',
    text: 'A final hand-polish, a signature stamp, and a rest in its pouch — checked twice before it earns your name.',
    image: 'photo-1605100804763-247f67b3557e',
  },
];

export default function CraftsmanshipPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Atelier"
        title="Made by hand, made to last."
        description="Luxury, to us, is not a logo — it is the hundred small decisions no one will ever see. Here is how a piece of AURELIA comes to be."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Craftsmanship' }]}
      />

      <Container className="pt-section">
        <div className="space-y-24 lg:space-y-32">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <Reveal className="img-zoom relative aspect-[4/3] overflow-hidden bg-champagne">
                <Image
                  src={`https://images.unsplash.com/${step.image}?auto=format&fit=crop&w=1200&q=80`}
                  alt={`${step.title} — AURELIA craftsmanship`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <span className="font-serif text-6xl text-gold/40">{step.n}</span>
                <h2 className="mt-4 font-serif text-4xl text-ink md:text-5xl">{step.title}</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-graphite/80">{step.text}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>

      <section className="mt-section bg-ink py-section text-ivory">
        <Container className="text-center">
          <Reveal>
            <p className="eyebrow mb-4">The promise</p>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight md:text-5xl text-balance">
              If it ever needs care, it comes home to us.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory/70">
              Complimentary cleaning, re-polishing and repair, for as long as you own your piece.
              That is what solid gold, made by hand, allows us to promise.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
