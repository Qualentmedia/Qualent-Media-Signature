export type Category = 'bracelets' | 'earrings' | 'gold-necklaces';

export interface CategoryMeta {
  slug: Category;
  name: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  currency: string;
  images: ProductImage[];
  shortDescription: string;
  description: string;
  materials: string[];
  details: string[];
  care: string;
  rating: number;
  reviewCount: number;
  badge?: 'New' | 'Bestseller' | 'Limited';
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}
