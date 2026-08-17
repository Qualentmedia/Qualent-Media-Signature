import type { Category, CategoryMeta, Product, Review } from './types';

/**
 * Product catalogue.
 *
 * In production this module is the single seam that a headless CMS or commerce
 * backend plugs into — swap the constant arrays for `await sanityClient.fetch`,
 * `shopify.product.fetchAll`, WooCommerce REST, Strapi or Contentful and every
 * component downstream keeps working, because they only consume the typed
 * `Product` / `Category` contracts declared in `./types`.
 */

const img = (id: string, alt: string) => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=80`,
  alt,
});

export const categories: CategoryMeta[] = [
  {
    slug: 'bracelets',
    name: 'Bracelets',
    title: 'Bracelets',
    tagline: 'Wristwork, weightless',
    description:
      'Fluid chains and hand-set cuffs designed to be layered and never removed — the quiet architecture of the everyday.',
    image:
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'earrings',
    name: 'Earrings',
    title: 'Earrings',
    tagline: 'Light, worn close',
    description:
      'From whisper-fine studs to sculptural drops, each pair is balanced by hand so it moves the way light does.',
    image:
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'gold-necklaces',
    name: 'Gold Necklaces',
    title: 'Gold Necklaces',
    tagline: 'Solid 18k, forever',
    description:
      'Necklaces cast in solid, responsibly sourced 18-karat gold — heirlooms engineered to outlast the trend that inspired them.',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80',
  },
];

export const products: Product[] = [
  // ---------------- Bracelets ----------------
  {
    id: 'br-01',
    slug: 'aurelia-serpentine-chain-bracelet',
    name: 'Serpentine Chain Bracelet',
    category: 'bracelets',
    price: 1280,
    currency: 'USD',
    images: [
      img('photo-1611652022419-a9419f74343d', 'Gold serpentine chain bracelet on wrist'),
      img('photo-1602751584552-8ba73aad10e1', 'Serpentine bracelet detail'),
    ],
    shortDescription: 'A liquid herringbone chain that pools against the wrist.',
    description:
      'The Serpentine is woven from more than four hundred individual links, then hand-polished to a mirror finish so it moves like poured metal. Weighted to sit flat against the skin, it is the piece we reach for first and remove last.',
    materials: ['18k recycled yellow gold', 'Hand-woven herringbone links', 'Concealed box clasp'],
    details: ['Width 5mm', 'Length 18cm, adjustable to 16cm', 'Weight 14g', 'Made in our SoHo atelier'],
    care: 'Store flat in the pouch provided. Avoid folding the chain sharply and remove before swimming.',
    rating: 4.9,
    reviewCount: 128,
    badge: 'Bestseller',
    isBestseller: true,
  },
  {
    id: 'br-02',
    slug: 'aurelia-solene-bangle',
    name: 'Solène Slim Bangle',
    category: 'bracelets',
    price: 940,
    currency: 'USD',
    images: [
      img('photo-1573408301185-9146fe634ad0', 'Slim gold bangle'),
      img('photo-1620656798579-1984d9e87df7', 'Gold bangle stacked'),
    ],
    shortDescription: 'A featherlight open cuff, engineered to be stacked.',
    description:
      'Solène is a study in restraint: a single continuous line of gold with a barely-there opening that slips on without a clasp. Wear one, or build a quiet stack of three.',
    materials: ['18k recycled yellow gold', 'Seamless open cuff', 'Polished finish'],
    details: ['Diameter 60mm', 'Bar width 2.4mm', 'Fits most wrists', 'Made in our SoHo atelier'],
    care: 'Reshape gently with both hands. Polish with the cloth provided.',
    rating: 4.8,
    reviewCount: 74,
    badge: 'New',
    isNew: true,
  },
  {
    id: 'br-03',
    slug: 'aurelia-lumiere-tennis-bracelet',
    name: 'Lumière Tennis Bracelet',
    category: 'bracelets',
    price: 3450,
    currency: 'USD',
    images: [
      img('photo-1602173574767-37ac01994b2a', 'Diamond tennis bracelet'),
      img('photo-1535632066927-ab7c9ab60908', 'Tennis bracelet clasp detail'),
    ],
    shortDescription: 'Forty brilliant-cut stones set in a continuous line of light.',
    description:
      'Each stone in the Lumière is hand-set in a four-prong basket that lifts it toward the light. The result is a river of brilliance that articulates softly around the wrist.',
    materials: ['18k white gold', '40 brilliant-cut lab-grown diamonds, 2.0ct total', 'Double-locking clasp'],
    details: ['Length 17cm', 'Stone size 1.7mm', 'Total 2.0 carat', 'GIA-graded stones'],
    care: 'Clean with warm water and a soft brush. Have prongs checked annually.',
    rating: 5.0,
    reviewCount: 41,
    badge: 'Limited',
  },
  // ---------------- Earrings ----------------
  {
    id: 'ea-01',
    slug: 'aurelia-goutte-drop-earrings',
    name: 'Goutte Drop Earrings',
    category: 'earrings',
    price: 1120,
    currency: 'USD',
    images: [
      img('photo-1635767798638-3e25273a8236', 'Gold drop earrings'),
      img('photo-1630019852942-f89202989a59', 'Drop earring detail'),
    ],
    shortDescription: 'A single suspended teardrop that catches the light as you move.',
    description:
      'Goutte — French for droplet — is cast from a single pour of gold and finished with a high polish so it reads as pure light in motion. Balanced to hang perfectly still until you do not.',
    materials: ['18k recycled yellow gold', 'Solid cast drop', 'Secure friction backs'],
    details: ['Drop length 32mm', 'Weight 3.1g each', 'Hypoallergenic posts', 'Made in our SoHo atelier'],
    care: 'Wipe with a soft cloth after wear. Store in the pouch provided.',
    rating: 4.9,
    reviewCount: 96,
    badge: 'Bestseller',
    isBestseller: true,
  },
  {
    id: 'ea-02',
    slug: 'aurelia-petite-pave-studs',
    name: 'Petite Pavé Studs',
    category: 'earrings',
    price: 690,
    currency: 'USD',
    images: [
      img('photo-1589674781759-c21c37956a44', 'Pave diamond stud earrings'),
      img('photo-1617038220319-276d3cfab638', 'Stud earring on ear'),
    ],
    shortDescription: 'Whisper-fine pavé studs for the everyday.',
    description:
      'A cluster of seven hand-set stones forms a single point of light no larger than a grain of sand. Designed to be worn and never thought about again.',
    materials: ['18k yellow gold', '14 lab-grown diamonds, 0.2ct total', 'Threaded backs'],
    details: ['Diameter 5mm', 'Total 0.2 carat', 'Threaded for security', 'Sold as a pair'],
    care: 'Clean gently with a soft brush and warm water.',
    rating: 4.8,
    reviewCount: 152,
    isNew: true,
    badge: 'New',
  },
  {
    id: 'ea-03',
    slug: 'aurelia-arc-hoop-earrings',
    name: 'Arc Hoop Earrings',
    category: 'earrings',
    price: 850,
    currency: 'USD',
    images: [
      img('photo-1630018548696-e1900d1b04a1', 'Gold hoop earrings'),
      img('photo-1588444650733-d0767b753fc8', 'Hoop earring detail'),
    ],
    shortDescription: 'A perfectly weighted hoop with a graduated profile.',
    description:
      'The Arc thickens imperceptibly toward its base, so it sits forward on the ear and holds its shape. A hinged closure disappears into the line.',
    materials: ['18k recycled yellow gold', 'Graduated tube profile', 'Hinged snap closure'],
    details: ['Diameter 28mm', 'Weight 4.4g each', 'Hinged closure', 'Made in our SoHo atelier'],
    care: 'Polish with the cloth provided. Avoid contact with fragrance.',
    rating: 4.9,
    reviewCount: 88,
  },
  // ---------------- Gold Necklaces ----------------
  {
    id: 'gn-01',
    slug: 'aurelia-eclat-pendant-necklace',
    name: 'Éclat Pendant Necklace',
    category: 'gold-necklaces',
    price: 1580,
    currency: 'USD',
    images: [
      img('photo-1599643478518-a784e5dc4c8f', 'Gold pendant necklace'),
      img('photo-1611085583191-a3b181a88401', 'Pendant necklace detail'),
    ],
    shortDescription: 'A solid-gold pendant suspended on a fine cable chain.',
    description:
      'Éclat pairs a hand-finished solid-gold medallion with a chain fine enough to disappear, so the pendant seems to float at the collarbone. An adjustable length lets it layer or stand alone.',
    materials: ['18k recycled yellow gold', 'Solid cast pendant', 'Fine cable chain'],
    details: ['Chain 42cm, adjustable to 46cm', 'Pendant 14mm', 'Lobster clasp', 'Made in our SoHo atelier'],
    care: 'Remove before showering. Store hanging to prevent tangles.',
    rating: 5.0,
    reviewCount: 64,
    badge: 'Bestseller',
    isBestseller: true,
  },
  {
    id: 'gn-02',
    slug: 'aurelia-colonne-chain-necklace',
    name: 'Colonne Chain Necklace',
    category: 'gold-necklaces',
    price: 2240,
    currency: 'USD',
    images: [
      img('photo-1611591437281-460bfbe1220a', 'Gold chain necklace'),
      img('photo-1636619612915-4b2e7b6b1a3a', 'Chain necklace clasp'),
    ],
    shortDescription: 'A substantial rolo chain with real presence.',
    description:
      'Colonne is our most architectural chain — solid rolo links with a soft-square profile that catch and hold the light. Weighted to drape, never to swing.',
    materials: ['18k recycled yellow gold', 'Solid rolo links', 'Engraved signature clasp'],
    details: ['Length 45cm', 'Link width 6mm', 'Weight 28g', 'Made in our SoHo atelier'],
    care: 'Polish with the cloth provided. Store flat.',
    rating: 4.9,
    reviewCount: 37,
    badge: 'Limited',
  },
  {
    id: 'gn-03',
    slug: 'aurelia-fil-dor-necklace',
    name: "Fil d'Or Layering Necklace",
    category: 'gold-necklaces',
    price: 780,
    currency: 'USD',
    images: [
      img('photo-1506630448388-4e683c67ddb0', 'Thin gold layering necklace'),
      img('photo-1620656798579-1984d9e87df7', 'Layering necklace detail'),
    ],
    shortDescription: 'The fine gold thread every layered look is built on.',
    description:
      "Fil d'Or is the quiet foundation of a considered stack — a barely-there gold thread that sits close to the throat and lets everything else speak.",
    materials: ['18k recycled yellow gold', 'Fine box chain', 'Spring-ring clasp'],
    details: ['Length 40cm, adjustable to 44cm', 'Width 1mm', 'Weight 3g', 'Made in our SoHo atelier'],
    care: 'Remove before sleeping to prevent kinks.',
    rating: 4.7,
    reviewCount: 210,
    isNew: true,
    badge: 'New',
  },
];

export const reviews: Record<string, Review[]> = {
  _default: [
    {
      id: 'r1',
      author: 'Camille R.',
      location: 'Paris, FR',
      rating: 5,
      title: 'Quietly perfect',
      body: 'It arrived in the most beautiful box and has not left my wrist since. The weight feels serious in the best way.',
      date: '2026-05-12',
    },
    {
      id: 'r2',
      author: 'Naomi T.',
      location: 'New York, US',
      rating: 5,
      title: 'Heirloom quality',
      body: 'You can feel the difference of solid gold immediately. Worth every cent — I bought a second for my sister.',
      date: '2026-04-28',
    },
    {
      id: 'r3',
      author: 'Ingrid S.',
      location: 'Copenhagen, DK',
      rating: 4,
      title: 'Beautiful, runs delicate',
      body: 'Exactly as photographed. Slightly finer than I expected but that is precisely why it layers so well.',
      date: '2026-03-19',
    },
  ],
};

// ------------------------------------------------------------------ //
//  Selectors                                                          //
// ------------------------------------------------------------------ //
export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function getCategory(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .concat(products.filter((p) => p.category !== product.category))
    .slice(0, limit);
}

export function getReviews(_productId: string): Review[] {
  return reviews._default;
}
