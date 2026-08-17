'use client';

import { useMemo, useState } from 'react';
import type { Product, Category } from '@/lib/types';
import { ProductGrid } from './ProductGrid';
import { cn } from '@/lib/utils';

type Filter = 'all' | Category;
type Sort = 'featured' | 'price-asc' | 'price-desc';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'gold-necklaces', label: 'Gold Necklaces' },
];

/** Client-side filter + sort over the catalogue for the Collections index. */
export function CollectionBrowser({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('featured');

  const visible = useMemo(() => {
    const list = filter === 'all' ? products : products.filter((p) => p.category === filter);
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, filter, sort]);

  return (
    <div>
      <div className="mb-12 flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {filters.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'border px-5 py-2 text-[0.68rem] uppercase tracking-luxe transition-colors duration-300',
                filter === f.value
                  ? 'border-ink bg-ink text-ivory'
                  : 'border-line text-graphite hover:border-ink hover:text-ink',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-[0.68rem] uppercase tracking-luxe text-graphite/60">Sort</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-line bg-ivory px-4 py-2 text-xs uppercase tracking-wide text-ink focus:border-ink focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <p className="mb-8 text-xs uppercase tracking-luxe text-graphite/50">{visible.length} pieces</p>
      <ProductGrid products={visible} columns={4} />
    </div>
  );
}
