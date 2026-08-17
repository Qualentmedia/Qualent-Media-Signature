import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/lib/products';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { ArrowIcon } from '@/components/ui/Icons';

export function FeaturedCollections() {
  return (
    <section className="pt-section">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Three houses of one maison"
          description="Each category is designed as its own quiet world — considered, complete, made to be mixed."
          href="/collections"
        />
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {categories.map((c, i) => (
            <Reveal key={c.slug} as="article" delay={i * 0.08}>
              <Link href={`/collections/${c.slug}`} className="group block">
                <div className="img-zoom relative aspect-[3/4] overflow-hidden bg-champagne">
                  <Image
                    src={c.image}
                    alt={`${c.name} collection`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-ivory">
                    <p className="text-[0.65rem] uppercase tracking-luxe text-gold-soft">{c.tagline}</p>
                    <h3 className="mt-2 flex items-center gap-3 font-serif text-3xl">
                      {c.name}
                      <ArrowIcon className="transition-transform duration-500 ease-luxe group-hover:translate-x-2" />
                    </h3>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
