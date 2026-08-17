import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { InstagramIcon } from '@/components/ui/Icons';
import { site } from '@/lib/site';

const shots = [
  'photo-1515562141207-7a88fb7ce338',
  'photo-1611591437281-460bfbe1220a',
  'photo-1605100804763-247f67b3557e',
  'photo-1602751584552-8ba73aad10e1',
  'photo-1599643478518-a784e5dc4c8f',
  'photo-1611652022419-a9419f74343d',
];

export function InstagramGallery() {
  return (
    <section className="pt-section">
      <Container>
        <SectionHeading
          eyebrow="@aurelia"
          title="Worn in the world"
          description="Tag @aurelia to be featured. A living lookbook, styled by the people who wear it."
          href={site.social.instagram}
          linkLabel="Follow"
        />
      </Container>
      <div className="grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 lg:grid-cols-6">
        {shots.map((id, i) => (
          <Reveal key={id} as="div" delay={(i % 6) * 0.05}>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="img-zoom group relative block aspect-square overflow-hidden bg-champagne"
            >
              <Image
                src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`}
                alt="AURELIA jewelry styled on Instagram"
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover"
              />
              <div className="absolute inset-0 grid place-items-center bg-ink/0 text-ivory opacity-0 transition-all duration-500 group-hover:bg-ink/40 group-hover:opacity-100">
                <InstagramIcon width={24} height={24} />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
