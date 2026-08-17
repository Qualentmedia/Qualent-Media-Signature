'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Product gallery with thumbnail navigation and cursor-tracked zoom.
 * On touch devices the zoom is disabled and tapping simply switches images.
 */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 lg:flex-col">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${name}`}
            aria-current={i === active}
            className={cn(
              'relative aspect-square w-16 shrink-0 overflow-hidden bg-champagne transition-opacity lg:w-20',
              i === active ? 'ring-1 ring-ink' : 'opacity-60 hover:opacity-100',
            )}
          >
            <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-champagne"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
      >
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn('object-cover transition-transform duration-500 ease-luxe', zoom && 'scale-[1.7]')}
          style={zoom ? { transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}
        />
      </div>
    </div>
  );
}
