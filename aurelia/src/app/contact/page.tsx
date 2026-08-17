import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/contact/ContactForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Speak with the AURELIA client team — for styling advice, bespoke commissions, or care and repairs.',
  alternates: { canonical: '/contact' },
};

const channels = [
  { label: 'Client care', value: site.email, href: `mailto:${site.email}` },
  { label: 'By phone', value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, '')}` },
  { label: 'The atelier', value: site.address },
  { label: 'Hours', value: 'Mon–Sat, 10am–6pm ET' },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We answer our own emails."
        description="For styling advice, a bespoke commission, or care for a piece you already own — a real person is here to help."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <Container className="pb-section pt-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal className="space-y-10">
            {channels.map((c) => (
              <div key={c.label} className="border-t border-line pt-5">
                <p className="text-[0.68rem] uppercase tracking-luxe text-graphite/55">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="mt-2 block font-serif text-2xl text-ink transition-colors hover:text-gold">
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-2 font-serif text-2xl leading-snug text-ink">{c.value}</p>
                )}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </>
  );
}
