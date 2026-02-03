// src/types.ts

// Mimicking WP GraphQL Structure
export interface WpImage {
  sourceUrl: string;
  altText: string;
}

export interface WpPrice {
  amount: number;
  formatted: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  thickness: number;
  area: number;
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
  brand: string;
  origin: string;
  surface: string;
  warranty: string;
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
  image: string;
  description?: string;
  headerImage?: string;
  bottomContent?: string;
  trendHeader?: string;
  trendContent?: string;
  warrantyMonths?: number;
}

export interface BannerConfig {
  title: string;
  description: string;
  trendContent: string;
  warrantyMonths: number;
  backgroundImage: string;
}

// --- BLOG TYPES ---
export interface Author {
  name: string;
  avatar: string;
  role: string;
}

// [FIX LỖI] Hợp nhất BlogPost thành 1 Interface duy nhất
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string; // Đã thêm trường này
  author: Author;   // Sử dụng interface Author chuẩn
  tags: string[];
}

// --- HERO SECTION TYPES ---
export interface HotspotItem {
  x: string;
  y: string;
  name: string;
  price: string;
  position: 'left' | 'right';
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
  ctaText?: string;
  hotspots: HotspotItem[];
  productLink?: string;
}

export interface SignatureTab {
  id: string | number;
  name: string;
  products: Product[];
}

export interface ShopLookItem {
  id: string | number;
  x: number;
  y: number;
  product: Product;
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

export interface AccessoryHighlight {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export interface HomeSettings {
  heroSlides: HeroSlide[];
  categoryHeadingNormal?: string;
  categoryHeadingHighlight?: string;
  categorySubheading?: string;
  catalogueText?: string;
  enableCategoryNofollow?: boolean;
  signatureHeadingNormal?: string;
  signatureHeadingHighlight?: string;
  signatureDesc?: string;
  signatureTabs: SignatureTab[];
  shopLookHeading?: string;
  shopLookSubheading?: string;
  shopLookImage?: string;
  shopLookItems: ShopLookItem[];
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
  qualityHeading: string;
  qualitySubheading: string;
  qualityLarge: QualityLargeCard;
  qualitySmall: QualitySmallCard[];
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
  materials: string[];
  gallery: string[];
  subtitle: string;
}

export type IconType = 'layers' | 'maximize' | 'zap' | 'mic' | 'shield' | 'droplets' | 'star' | 'default';

export interface Hotspot {
  x: number;
  y: number;
  label: string;
  description: string;
  iconType: IconType;
}

export interface Stat {
  label: string;
  value: string;
}

export interface ApplicationSpace {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  hotspots: Hotspot[];
  stats: Stat[];
}

export interface RenovationFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface CommercialItem {
  image: string;
  title: string;
  desc: string;
}

export interface ApplicationPageData {
  heroTitle: string;
  heroDesc: string;
  spaces: ApplicationSpace[];
  renovationHeading: string;
  renovationDesc: string;
  beforeImage: string;
  afterImage: string;
  renovationFeatures: RenovationFeature[];
  commHeading: string;
  commDesc: string;
  commItems: CommercialItem[];
  commLinkText: string;
  commLinkUrl: string;
  ctaHeading: string;
  ctaDesc: string;
  ctaBtnPrimary: string;
  ctaBtnSecondary: string;
}

// --- PRICING TYPES ---
export interface TurnkeyPackage {
  id: string | number;
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  isPopular: boolean;
  styleType: 'standard' | 'dark' | 'gold';
}

export interface ConstructionStep {
  step: string;
  title: string;
  desc: string;
  icon: string;
}

export interface MaterialItem {
  name: string;
  price: string;
  unit: string;
  image: string;
  link: string;
}

export interface AccessoryItem {
  name: string;
  price: string;
  image: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CommitmentItem {
  icon: string;
  title: string;
  desc: string;
}

export interface PricingPageData {
  heroTitle: string;
  heroDesc: string;
  calculatorProduct: Product | null;
  basePriceTurnkey: number;
  pkgHeading: string;
  pkgDesc: string;
  turnkeyPackages: TurnkeyPackage[];
  stepsHeading: string;
  stepsDesc: string;
  constructionSteps: ConstructionStep[];
  commitments: CommitmentItem[];
  materialsHeading: string;
  materialsDesc: string;
  materialItems: MaterialItem[];
  accHeading: string;
  accDesc: string;
  accessoryItems: AccessoryItem[];
  faqs: FaqItem[];
  ctaHeading: string;
  ctaDesc: string;
}

export interface ContactTopic {
    value: string;
    label: string;
}

export interface ContactFormConfig {
    heading: string;
    desc: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    btnText: string;
    successTitle: string;
    successMessage: string;
    topics: ContactTopic[];
}

export interface ContactFaq {
    question: string;
    answer: string;
}

export interface ContactPageData {
  heroTitle: string;
  heroDesc: string;
  heroImage: string;
  info: {
    address: string;
    hotline: string;
    email: string;
    workingHours: string;
    zaloUrl: string;
    facebookUrl: string;
  };
  mapUrl: string;
  form: {
    heading: string;
    desc: string;
  };
  formConfig: ContactFormConfig;
  faqsContact: ContactFaq[];
}