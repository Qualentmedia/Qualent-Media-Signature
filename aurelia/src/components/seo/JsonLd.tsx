import { site } from '@/lib/site';
import type { Product } from '@/lib/types';

/** Renders a JSON-LD script tag. Safe: data is our own, serialized server-side. */
function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: site.legalName,
        alternateName: site.name,
        url: site.url,
        logo: `${site.url}/logo.png`,
        email: site.email,
        telephone: site.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '11 Greene Street',
          addressLocality: 'New York',
          addressRegion: 'NY',
          postalCode: '10013',
          addressCountry: 'US',
        },
        sameAs: Object.values(site.social),
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: site.name,
        url: site.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${site.url}/collections?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images.map((i) => i.src),
        description: product.shortDescription,
        sku: product.id.toUpperCase(),
        brand: { '@type': 'Brand', name: site.name },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: product.currency,
          price: product.price,
          availability: 'https://schema.org/InStock',
          url: `${site.url}/product/${product.slug}`,
          itemCondition: 'https://schema.org/NewCondition',
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${site.url}${item.url}`,
        })),
      }}
    />
  );
}
