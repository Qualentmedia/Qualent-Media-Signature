import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

const pillars = [
  { n: '01', label: 'Responsibly sourced', text: '100% recycled 18k gold and traceable stones.' },
  { n: '02', label: 'Hand-finished', text: 'Every piece polished by a single maker in SoHo.' },
  { n: '03', label: 'Made to endure', text: 'Solid gold throughout — never plated, never hollow.' },
];

export function Craftsmanship() {
  return (
    <section className="pt-section">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="img-zoom relative aspect-[4/5] overflow-hidden bg-champagne">
            <Image
              src="https://images.unsplash.com/photo-1633934542430-0905ccb5f050?auto=format&fit=crop&w=1200&q=80"
              alt="A jeweler hand-finishing a gold piece at the bench"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow mb-3">The Atelier</p>
              <h2 className="font-serif text-4xl leading-[1.05] text-ink md:text-5xl text-balance">
                A slower kind of luxury
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-graphite/80">
                We make a small number of pieces, well. Each begins as raw recycled
                gold and passes through a single pair of hands — cast, filed, set and
                polished at our bench on Greene Street until it is worthy of your name.
              </p>
            </Reveal>

            <div className="mt-10 divide-y divide-line border-y border-line">
              {pillars.map((p, i) => (
                <Reveal key={p.n} as="div" delay={i * 0.08} className="flex gap-6 py-5">
                  <span className="font-serif text-lg text-gold">{p.n}</span>
                  <div>
                    <h3 className="text-sm uppercase tracking-luxe text-ink">{p.label}</h3>
                    <p className="mt-1 text-sm text-graphite/75">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-10">
              <Button href="/craftsmanship" variant="outline">Discover the Process</Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
