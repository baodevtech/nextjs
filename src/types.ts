
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
  nofollow?: boolean;
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
export interface SignatureTab {
  id: string | number;
  name: string;
  products: Product[]; // Sử dụng lại interface Product đã có
}
export interface ShopLookItem {
  id: string | number;
  x: number;
  y: number;
  product: Product; // Sản phẩm gắn với điểm đó
}
export interface QualityTag {
  text: string;
}

export interface QualityLargeCard {
  icon: string;
  title: string;
  description: string;
  image: string;
  tags: QualityTag[];
}

export interface QualitySmallCard {
  icon: string;
  title: string;
  description: string;
}
// [THÊM MỚI] Dữ liệu thẻ highlight phụ kiện
export interface AccessoryHighlight {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;       // Đã format: "20/01/2026"
  image: string;      // Ảnh đại diện
  category: string;   // Tên danh mục đầu tiên
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}
export interface HomeSettings {
  // --- HERO SECTION ---
  heroSlides: HeroSlide[];
  // --- CATEGORY SECTION ---
  categoryHeadingNormal?: string;
  categoryHeadingHighlight?: string;
  categorySubheading?: string;
  catalogueText?: string;
  enableCategoryNofollow?: boolean;
  // --- SIGNATURE SECTION ---
  signatureHeadingNormal?: string;
  signatureHeadingHighlight?: string;
  signatureDesc?: string;
  signatureTabs: SignatureTab[]; // Mảng các Tab
  // --- SHOP THE LOOK  ---
  shopLookHeading?: string;
  shopLookSubheading?: string;
  shopLookImage?: string;
  shopLookItems: ShopLookItem[];
  // --- ACCESSORIES SECTION  ---
  headNormal: string;
  headHighlight: string;
  phuKienSub: string;
  accHighlights: AccessoryHighlight[];
  accViewAll: {
    text: string;
    sub: string;
    link: string;
  };
  accProdHeading: string;
  accProducts: Product[]; 
  // --- QUALITY SECTION ---
  qualityHeading: string;
  qualitySubheading: string;
  qualityLarge: QualityLargeCard;
  qualitySmall: QualitySmallCard[];
  // --- BLOG SECTION ---
  blogPosts: BlogPost[]; 
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;     
  categorySlug: string;  
  tags: string[];
  location: string;
  year: string;
  area: string;
  desc: string;
  architect: string;
  client: string;
  challenge: string;
  solution: string;
  materials: string[]; // Chuyển thành mảng string
  gallery: string[];   // Album ảnh
  subtitle: string;    // Có thể dùng category làm subtitle
}