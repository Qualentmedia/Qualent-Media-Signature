import { Hero } from '@/components/home/Hero';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { ProductRail } from '@/components/home/ProductRail';
import { Craftsmanship } from '@/components/home/Craftsmanship';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { Newsletter } from '@/components/home/Newsletter';
import { getBestsellers, getNewArrivals } from '@/lib/products';

export default function HomePage() {
  const bestsellers = getBestsellers();
  const newArrivals = getNewArrivals();

  return (
    <>
      <Hero />
      <FeaturedCollections />
      <ProductRail
        eyebrow="Most loved"
        title="Best sellers"
        description="The pieces our clients return for, again and again."
        products={bestsellers}
        href="/collections"
      />
      <Craftsmanship />
      <ProductRail
        eyebrow="Just arrived"
        title="New arrivals"
        description="The latest from the bench, freshly finished and ready to be worn."
        products={newArrivals}
        href="/collections?filter=new"
      />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
