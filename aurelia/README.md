# AURELIA — Luxury Fine-Jewelry eCommerce

An original, production-ready luxury jewelry storefront built to feel as
considered as the grand fashion houses while being entirely its own maison.
Bracelets, earrings and solid 18k gold necklaces, presented with editorial
restraint, premium photography and quiet motion.

> Not a template. Every component, token and layout in this project is custom.

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript (strict) ·
Tailwind CSS · Framer Motion. Zero UI-kit boilerplate — a small, bespoke
component library.

---

## Quick start

```bash
cd aurelia
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (fully static / SSG)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit (strict)
```

The production build prerenders all 32 routes as static HTML (SSG) — home,
collections, three category pages, nine product pages, journal + articles, and
every editorial/commerce page — for instant loads and CDN cacheability.

---

## Design system

### Color palette (design tokens)

Defined once as CSS custom properties in `src/app/globals.css` and mirrored in
`tailwind.config.ts`, so every surface reads from one source of truth.

| Token | Hex | Role |
| --- | --- | --- |
| `ink` | `#0F0F0F` | Deep black — primary, dark sections, buttons |
| `charcoal` | `#2A2A2A` | Body text |
| `graphite` | `#4A4744` | Secondary text |
| `ivory` | `#FAF8F5` | Warm white — primary background |
| `champagne` | `#EFE7DA` | Soft feature backgrounds, image wells |
| `beige` / `sand` | `#E7DDCE` / `#D9CDB8` | Supporting neutrals |
| `gold` | `#C8A96A` | Luxury accent — hovers, eyebrows, focus ring |
| `gold-deep` / `gold-soft` | `#A98545` / `#DCC79B` | Accent range |
| `line` | `#E7E1D8` | Hairline dividers |

No bright colors, no cheap gradients — only warm neutrals with a single gold accent.

### Typography system

- **Headings** — Cormorant Garamond (editorial serif), loaded via `next/font`
  as `--font-serif`. Large, generous, letter-spacing tuned negative on display sizes.
- **Body / UI** — Inter, loaded as `--font-sans`. Uppercase micro-labels use a
  wide `tracking-luxe` (0.22em) for the couture feel.
- Custom fluid type ramp: `text-display`, `text-hero` use `clamp()` to scale
  seamlessly from mobile to ultra-wide.

### Motion

Tasteful, never loud. Tokens: `--ease-luxe` `cubic-bezier(0.16,1,0.3,1)`.

- Scroll reveals via `Reveal` (Framer Motion `whileInView`, once).
- Hero staggered fade-up; testimonial + quick-view crossfades.
- Image zoom on hover (`.img-zoom`), gold link underlines, sticky header blur.
- **Fully respects `prefers-reduced-motion`** (CSS + Framer `useReducedMotion`).

---

## Folder structure

```
aurelia/
├─ src/
│  ├─ app/                     # App Router routes
│  │  ├─ layout.tsx            # fonts, providers, header/footer, global SEO
│  │  ├─ page.tsx              # Home
│  │  ├─ globals.css           # design tokens + component utilities
│  │  ├─ collections/          # index + [category] dynamic listing
│  │  ├─ product/[slug]/       # product detail (gallery, zoom, reviews)
│  │  ├─ journal/              # blog index + [slug] article
│  │  ├─ about/ craftsmanship/ lookbook/ contact/ faq/
│  │  ├─ wishlist/ cart/ checkout/
│  │  ├─ sitemap.ts robots.ts manifest.ts   # SEO endpoints
│  │  └─ not-found.tsx loading.tsx
│  ├─ components/
│  │  ├─ layout/               # Header, Footer, CartDrawer, AnnouncementBar, PageHeader
│  │  ├─ home/                 # Hero, FeaturedCollections, ProductRail, Craftsmanship…
│  │  ├─ product/              # ProductCard, ProductGrid, QuickView, Gallery, PurchasePanel…
│  │  ├─ contact/ seo/ ui/     # ContactForm; JsonLd; Button, Container, Reveal, Icons
│  ├─ context/StoreProvider.tsx  # cart + wishlist (localStorage, reducer)
│  └─ lib/                     # products, journal, site config, types, utils
└─ public/                     # icon.svg
```

---

## Component library (reusable)

`Button` (variants: primary / outline / ghost / light · polymorphic link),
`Container`, `Reveal`, `Icons` (hairline set), `ProductCard` (hover image swap,
quick view, wishlist), `ProductGrid`, `QuickView`, `ProductGallery` (cursor
zoom), `PurchasePanel` (sticky add-to-cart + accordions), `Accordion`,
`Reviews`, `SectionHeading`, `PageHeader`, `CartDrawer`, `ContactForm`, JSON-LD
helpers. All typed against the `Product` / `Category` contracts.

---

## SEO implementation

- Per-route `generateMetadata` — titles (templated), descriptions, canonicals.
- **Open Graph + Twitter Cards** site-wide and per product/article.
- **Structured data (JSON-LD):** Organization, WebSite (+SearchAction), Product
  (with AggregateRating + Offer), BreadcrumbList, Article.
- `sitemap.xml`, `robots.txt` and PWA `manifest` generated from data at build.
- Semantic HTML throughout (`header/nav/main/section/article/figure/address`).

## Accessibility

- Skip-to-content link, visible gold focus rings, `:focus-visible` only.
- ARIA on interactive controls (cart/qty/wishlist/tabs/dialogs), `aria-pressed`,
  `aria-current`, `aria-modal`, labelled regions.
- Keyboard-reachable Quick View / drawers with `Esc` to close and scroll lock.
- Reduced-motion honored; color contrast tuned for WCAG AA on text.

## Performance

- Static generation (SSG) for every route; ~87 kB shared JS.
- `next/image` (AVIF/WebP, responsive `sizes`, lazy by default, priority hero).
- `next/font` self-hosts fonts with `display: swap` — no layout shift, no
  render-blocking third-party CSS.
- Code-split client islands (only cart/gallery/forms ship JS); the rest is RSC.

---

## Connecting a CMS / commerce backend

The catalogue lives behind a single typed seam — `src/lib/products.ts`. Every
component consumes the `Product` / `Category` types, never the data source, so
swapping in a backend touches only this file:

| Platform | Where it plugs in |
| --- | --- |
| **Shopify** | Storefront API in the `get*` selectors; map to `Product` |
| **Sanity** | `sanityClient.fetch(GROQ)` (host already in `next.config`) |
| **Contentful / Strapi** | REST/GraphQL fetch in the selectors |
| **WooCommerce** | WC REST API → `Product` mapping |

Checkout (`/checkout`) and the newsletter/contact forms are wired as the
hand-off points for Stripe / Shopify Checkout and an ESP (Klaviyo, Mailchimp).

---

## Notes

Product and editorial photography uses Unsplash CDN URLs (allow-listed in
`next.config.mjs`) as high-quality placeholders; replace with owned/licensed
assets or CMS images for production.
