export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  body: string[];
}

export const journalPosts: JournalPost[] = [
  {
    slug: 'the-case-for-solid-gold',
    title: 'The quiet case for solid gold',
    excerpt:
      'Why we will never plate a single piece — and what that means for the jewelry you keep for life.',
    category: 'Craft',
    date: '2026-07-02',
    readTime: '4 min',
    image: 'photo-1633934542430-0905ccb5f050',
    body: [
      'Plated jewelry is a promise with an expiry date. A micron of gold over brass looks identical on day one and betrays itself by month six — a green wrist, a dull edge, a piece retired to a drawer.',
      'Solid gold makes a different promise. Because the metal is the same all the way through, there is nothing to wear away. Scratches polish out. The colour never changes. It can be passed down precisely because it was never a surface in the first place.',
      'It costs more, and it should. But amortised across a lifetime — or several — solid gold is the more honest luxury. It is the difference between owning a piece and merely renting its appearance.',
    ],
  },
  {
    slug: 'how-to-layer-necklaces',
    title: 'The art of layering, without trying',
    excerpt: 'A short field guide to building a necklace stack that looks accidental — and never is.',
    category: 'Style',
    date: '2026-06-14',
    readTime: '5 min',
    image: 'photo-1506630448388-4e683c67ddb0',
    body: [
      'The best layered looks obey one rule: contrast in length, harmony in tone. Begin with a fine chain that sits high at the throat, then descend in confident increments — never in even steps.',
      'Three is the number that reads as considered rather than crowded. A close choker, a mid-length with a single pendant, and one longer chain to draw the eye down. Keep every piece in the same metal and the whole reads as one gesture.',
      'And then leave it. The moment a stack looks laboured, it has failed. Put it on in the morning and forget it — that is the entire point.',
    ],
  },
  {
    slug: 'inside-the-soho-atelier',
    title: 'A morning inside the SoHo atelier',
    excerpt: 'From raw recycled gold to a finished clasp — the unhurried hours behind a single bracelet.',
    category: 'Atelier',
    date: '2026-05-20',
    readTime: '6 min',
    image: 'photo-1600003263720-95b45a4035d5',
    body: [
      'The bench is quiet before nine. Light comes in low from Greene Street, and the first task is always the same: weigh the gold, and account for every gram of it.',
      'What follows cannot be rushed. Casting, filing, the slow rhythm of setting stones one prong at a time. A single bracelet may pass a full day at the bench, most of it spent on details no customer will ever consciously notice — and every one of which they would feel if it were missing.',
      'By late afternoon a piece is polished, stamped, and resting in its pouch. It looks, finally, effortless. That is the last and hardest thing we make: the appearance of ease.',
    ],
  },
];

export function getPost(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}
