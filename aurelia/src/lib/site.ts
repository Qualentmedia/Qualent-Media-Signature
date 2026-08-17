export const site = {
  name: 'AURELIA',
  legalName: 'Aurelia Fine Jewelry',
  tagline: 'Fine jewelry, quietly made.',
  description:
    'AURELIA is a modern maison of fine jewelry — bracelets, earrings and solid-gold necklaces handcrafted from responsibly sourced 18k gold and heirloom-grade stones.',
  url: 'https://aurelia.example.com',
  locale: 'en_US',
  currency: 'USD',
  email: 'atelier@aurelia.example.com',
  phone: '+1 (212) 555-0147',
  address: '11 Greene Street, SoHo, New York, NY 10013',
  social: {
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
    tiktok: 'https://tiktok.com',
  },
  ogImage:
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
} as const;

export const primaryNav = [
  { label: 'Collections', href: '/collections' },
  { label: 'Bracelets', href: '/collections/bracelets' },
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Gold Necklaces', href: '/collections/gold-necklaces' },
  { label: 'Craftsmanship', href: '/craftsmanship' },
  { label: 'Journal', href: '/journal' },
];

export const footerNav = {
  Shop: [
    { label: 'Bracelets', href: '/collections/bracelets' },
    { label: 'Earrings', href: '/collections/earrings' },
    { label: 'Gold Necklaces', href: '/collections/gold-necklaces' },
    { label: 'New Arrivals', href: '/collections?filter=new' },
    { label: 'Lookbook', href: '/lookbook' },
  ],
  Maison: [
    { label: 'About AURELIA', href: '/about' },
    { label: 'Our Craftsmanship', href: '/craftsmanship' },
    { label: 'Journal', href: '/journal' },
    { label: 'Contact', href: '/contact' },
  ],
  Client: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/faq#shipping' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
  ],
} as const;
