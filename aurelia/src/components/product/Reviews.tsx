import type { Review } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';
import { StarIcon } from '@/components/ui/Icons';

export function Reviews({ reviews, rating, count }: { reviews: Review[]; rating: number; count: number }) {
  return (
    <div>
      <div className="mb-12 flex flex-col gap-3 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3">Client reviews</p>
          <h2 className="font-serif text-4xl text-ink md:text-5xl">Worn, loved, reviewed</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} filled={i < Math.round(rating)} width={18} height={18} />
            ))}
          </div>
          <span className="text-sm text-graphite/70">{rating} out of 5 · {count} reviews</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.id} as="article" delay={i * 0.08} className="border-t border-line pt-6">
            <div className="mb-4 flex text-gold">
              {Array.from({ length: 5 }).map((_, s) => (
                <StarIcon key={s} filled={s < r.rating} width={13} height={13} />
              ))}
            </div>
            <h3 className="font-serif text-xl text-ink">{r.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-graphite/80">{r.body}</p>
            <footer className="mt-5 text-[0.68rem] uppercase tracking-luxe text-graphite/55">
              {r.author} · {r.location}
            </footer>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
