
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
export interface PolicyBlock {
  icon: string;
  heading: string;
  content: string;
}
export interface Product {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  brand: string; // Vẫn giữ string, nhưng dữ liệu lấy từ Taxonomy
  origin: string; // Mới: Xuất xứ
  surface: string; // Mới: Bề mặt
  warranty: string; // Mới: Bảo hành
  description: string;
  shortDescription: string;
  image: WpImage;
  galleryImages: WpImage[];
  price: WpPrice;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  sku: string;
  categories: string[];
  dimensions: ProductDimensions;
  banner?: {
    shortDescription: string;
    warranty: PolicyBlock;
    shipping: PolicyBlock;
    variety: PolicyBlock;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;      // Ảnh nhỏ (Thumbnail)
  description?: string;
  
  // --- CÁC TRƯỜNG MỚI TỪ ACF ---
  headerImage?: string;   // Ảnh Banner lớn
  bottomContent?: string; // Nội dung SEO dưới cùng
  trendHeader?: string;   // Tiêu đề xu hướng (VD: XU HƯỚNG 2024)
  trendContent?: string;  // Nội dung xu hướng
  warrantyMonths?: number; // Số năm bảo hành
}

// --- THÊM MỚI INTERFACE CHO BANNER ---
export interface BannerConfig {
  title: string;
  description: string;
  trendContent: string;   // Nội dung xu hướng (VD: "Xu hướng 2026")
  warrantyMonths: number; // Số tháng bảo hành (VD: 240)
  backgroundImage: string;
}

// --- BLOG TYPES ---
export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: Author;
  tags: string[];
}

// --- HERO SECTION TYPES (NEW) ---
export interface HotspotItem {
  x: string; // Vd: "55%"
  y: string; // Vd: "40%"
  name: string;
  price: string;
  position: 'left' | 'right'; // Vị trí tooltip
  link?: string;
}

export interface HeroSlide {
  id: number | string;
  subtitle: string;
  title: string;
  description: string;
  image: string;
  ctaLink: string;
  ctaText?: string; // Nút bấm
  hotspots: HotspotItem[];
  productLink?: string;
}

export interface HomeSettings {
  heroSlides: HeroSlide[];
  // Có thể thêm các field khác của Home ở đây
}