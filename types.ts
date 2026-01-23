// Mimicking WP GraphQL Structure
export interface WpImage {
  sourceUrl: string;
  altText: string;
}

export interface WpPrice {
  amount: number; // Changed to number for easier calc
  formatted: string; // "150.000₫"
}

export interface ProductDimensions {
  length: number; // mm
  width: number; // mm
  thickness: number; // mm
  area: number; // m2 per piece
}

export interface Product {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  brand: string; // Added Brand field
  description: string; // HTML string
  shortDescription: string;
  image: WpImage;
  galleryImages: WpImage[];
  price: WpPrice;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  sku: string;
  categories: string[];
  dimensions: ProductDimensions; // Added specific dimensions
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string; // Thumbnail
  headerImage?: string; // Large banner
  description?: string; // Short intro
  bottomContent?: string; // Long HTML content for SEO/Education
}