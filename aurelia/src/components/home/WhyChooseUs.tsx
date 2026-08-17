import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

const reasons = [
  { title: 'Solid, never plated', text: 'Real 18k gold all the way through, so it never fades or wears thin.' },
  { title: 'Lifetime guarantee', text: 'Complimentary cleaning, re-polishing and repair for as long as you own it.' },
  { title: 'Insured worldwide delivery', text: 'Discreet, tracked and fully insured shipping to your door in signature packaging.' },
  { title: '30-day reflection', text: 'Take your time. Returns and exchanges are effortless within thirty days.' },
];

export function WhyChooseUs() {
  return (
    <section className="pt-section">
      <Container>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} as="div" delay={(i % 4) * 0.06} className="border-t border-line pt-6">
              <span className="font-serif text-2xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-serif text-xl text-ink">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite/75">{r.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
