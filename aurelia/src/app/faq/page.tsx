import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Accordion } from '@/components/product/Accordion';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers on materials, sizing, shipping, returns and care for your AURELIA jewelry.',
  alternates: { canonical: '/faq' },
};

const groups = [
  {
    id: 'materials',
    heading: 'Materials & Craft',
    items: [
      { title: 'Is your gold solid or plated?', content: <p>Every AURELIA piece is solid 18-karat gold throughout — never plated, never filled. It will not fade, tarnish or wear thin, which is exactly why we can offer a lifetime guarantee.</p> },
      { title: 'Where is your gold sourced?', content: <p>We use 100% recycled 18k gold and traceable, conflict-free stones. Recycling existing gold avoids new mining entirely while delivering identical quality.</p> },
      { title: 'Are your diamonds natural or lab-grown?', content: <p>Our diamond pieces use lab-grown stones, which are chemically and optically identical to mined diamonds, fully traceable, and considerably kinder to both the planet and your budget.</p> },
    ],
  },
  {
    id: 'sizing',
    heading: 'Sizing & Fit',
    items: [
      { title: 'How do I find my size?', content: <p>Most bracelets are adjustable and necklaces list their length range on each product page. For anything else, our client team offers a complimentary virtual fitting — just reach out via Contact.</p> },
      { title: 'Can pieces be resized?', content: <p>Many can. Because we work in solid gold, resizing and lengthening are often possible at our bench. Contact us with your piece and we will advise.</p> },
    ],
  },
  {
    id: 'shipping',
    heading: 'Shipping & Returns',
    items: [
      { title: 'How long does shipping take?', content: <p>Orders ship fully insured and carbon-neutral within 2–4 business days, in signature packaging with tracked, signature-on-delivery service. Worldwide shipping is complimentary.</p> },
      { title: 'What is your returns policy?', content: <p>Returns and exchanges are complimentary within 30 days of delivery, provided the piece is unworn and in its original packaging. Bespoke commissions are final sale.</p> },
      { title: 'Do you ship internationally?', content: <p>Yes — we ship worldwide with insured, duties-paid delivery to most countries. Any applicable taxes are shown transparently at checkout.</p> },
    ],
  },
  {
    id: 'care',
    heading: 'Care & Guarantee',
    items: [
      { title: 'How do I care for my jewelry?', content: <p>Wipe with the polishing cloth provided, avoid contact with fragrance and chlorine, and store flat in your pouch. Solid gold is remarkably forgiving — most marks polish out completely.</p> },
      { title: 'What does the lifetime guarantee cover?', content: <p>Complimentary cleaning, re-polishing and repair for as long as you own your piece. If it ever needs attention, it simply comes home to the atelier.</p> },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Client Care"
        title="Everything you might wonder."
        description="And if your question is not here, our client team is one email away."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />

      <Container className="pb-section pt-16">
        <div className="mx-auto max-w-3xl space-y-16">
          {groups.map((g) => (
            <Reveal key={g.id} as="section" id={g.id}>
              <h2 className="mb-6 font-serif text-3xl text-ink">{g.heading}</h2>
              <Accordion items={g.items} />
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
