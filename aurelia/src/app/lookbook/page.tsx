import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Lookbook',
  description: 'The AURELIA 2026 lookbook — solid gold, styled and worn in the world.',
  alternates: { canonical: '/lookbook' },
};

// Mixed aspect ratios create an editorial, gallery-like rhythm.
const shots: { id: string; span: string; ratio: string; caption?: string }[] = [
  { id: 'photo-1515562141207-7a88fb7ce338', span: 'md:col-span-2 md:row-span-2', ratio: 'aspect-[4/5]', caption: 'The Serpentine, layered' },
  { id: 'photo-1635767798638-3e25273a8236', span: '', ratio: 'aspect-square' },
  { id: 'photo-1611591437281-460bfbe1220a', span: '', ratio: 'aspect-square' },
  { id: 'photo-1611652022419-a9419f74343d', span: 'md:col-span-2', ratio: 'aspect-[16/10]', caption: 'Wrists, stacked' },
  { id: 'photo-1599643478518-a784e5dc4c8f', span: '', ratio: 'aspect-square' },
  { id: 'photo-1617038220319-276d3cfab638', span: 'md:col-span-2 md:row-span-2', ratio: 'aspect-[4/5]', caption: 'Éclat, worn close' },
  { id: 'photo-1602751584552-8ba73aad10e1', span: '', ratio: 'aspect-square' },
  { id: 'photo-1630018548696-e1900d1b04a1', span: '', ratio: 'aspect-square' },
];

export default function LookbookPage() {
  return (
    <>
      <PageHeader
        eyebrow="2026 Lookbook"
        title="Light, gold, and the people who wear it."
        description="Photographed in natural light across a single New York morning. No retouching of the gold — only of the moment."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Lookbook' }]}
      />

      <Container className="pt-16">
        <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {shots.map((s, i) => (
            <Reveal key={i} as="div" delay={(i % 4) * 0.05} className={s.span}>
              <figure className={`img-zoom relative ${s.ratio} h-full overflow-hidden bg-champagne`}>
                <Image
                  src={`https://images.unsplash.com/${s.id}?auto=format&fit=crop&w=1200&q=80`}
                  alt={s.caption ?? 'AURELIA lookbook image'}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                {s.caption && (
                  <figcaption className="absolute bottom-4 left-4 text-[0.65rem] uppercase tracking-luxe text-ivory drop-shadow">
                    {s.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <Link href="/collections" className="text-xs uppercase tracking-luxe text-ink link-underline">
            Shop the looks
          </Link>
        </Reveal>
      </Container>
    </>
  );
}
