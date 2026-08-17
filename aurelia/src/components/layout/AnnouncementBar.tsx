const messages = [
  'Complimentary insured shipping worldwide',
  'Lifetime craftsmanship guarantee',
  'Hand-finished in our SoHo atelier',
  'Responsibly sourced 18k gold',
];

/** Slow gold marquee — a single quiet line of reassurance above the header. */
export function AnnouncementBar() {
  return (
    <div className="bg-ink text-ivory">
      <div className="flex overflow-hidden py-2.5">
        <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16 motion-reduce:animate-none">
          {[...messages, ...messages].map((m, i) => (
            <span key={i} className="whitespace-nowrap text-[0.6rem] uppercase tracking-luxe text-ivory/80">
              {m}
            </span>
          ))}
        </div>
        <div aria-hidden className="flex shrink-0 animate-marquee items-center gap-16 pr-16 motion-reduce:hidden">
          {[...messages, ...messages].map((m, i) => (
            <span key={i} className="whitespace-nowrap text-[0.6rem] uppercase tracking-luxe text-ivory/80">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
