import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { getAllProducts, categories } from '@/lib/products';
import { journalPosts } from '@/lib/journal';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    '', '/collections', '/about', '/craftsmanship', '/lookbook',
    '/journal', '/contact', '/faq', '/wishlist', '/cart',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productRoutes = getAllProducts().map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const journalRoutes = journalPosts.map((post) => ({
    url: `${base}/journal/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...journalRoutes];
}
