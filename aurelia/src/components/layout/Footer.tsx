import Link from 'next/link';
import { footerNav, site } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { InstagramIcon, ArrowIcon } from '@/components/ui/Icons';

export function Footer() {
  return (
    <footer className="mt-section bg-ink text-ivory">
      <Container className="py-20">
        {/* Newsletter + wordmark */}
        <div className="grid gap-12 border-b border-ivory/10 pb-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">{site.name}</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/60">{site.tagline}</p>
          </div>
          <div className="lg:justify-self-end lg:text-right">
            <p className="eyebrow">The Correspondence</p>
            <p className="mt-3 max-w-sm font-serif text-2xl leading-snug text-ivory lg:ml-auto">
              Private views, new arrivals and the occasional letter from the atelier.
            </p>
            <form className="mt-6 flex max-w-md items-center border-b border-ivory/25 lg:ml-auto">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Email address"
                className="h-12 w-full bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="shrink-0 text-ivory transition-colors hover:text-gold">
                <ArrowIcon />
              </button>
            </form>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
          {Object.entries(footerNav).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <h3 className="eyebrow mb-5">{heading}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ivory/70 transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h3 className="eyebrow mb-5">Atelier</h3>
            <address className="space-y-3 text-sm not-italic text-ivory/70">
              <p>{site.address}</p>
              <p><a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">{site.email}</a></p>
              <p><a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} className="transition-colors hover:text-gold">{site.phone}</a></p>
            </address>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="mt-5 inline-flex text-ivory/70 transition-colors hover:text-gold">
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 text-[0.68rem] uppercase tracking-luxe text-ivory/40 md:flex-row">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="transition-colors hover:text-gold">Privacy</Link>
            <Link href="/faq" className="transition-colors hover:text-gold">Terms</Link>
            <Link href="/faq" className="transition-colors hover:text-gold">Accessibility</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
