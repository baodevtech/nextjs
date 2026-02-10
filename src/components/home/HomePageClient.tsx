'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Product, Category, HomeSettings } from '@/types';

// 1. ABOVE THE FOLD (Load ngay lập tức để tối ưu LCP/CLS)
// Hero và Category là những thứ khách thấy đầu tiên, không được lazy load
import { HeroSection } from './sections/HeroSection';
import { CategoryShowcase } from './sections/CategoryShowcase';

// 2. BELOW THE FOLD (Lazy Load để giảm Bundle Size và TBT)
// Tạo một khung xương (Skeleton) nhẹ để hiển thị trong lúc chờ tải component thật
const SectionSkeleton = () => (
  <div className="w-full h-96 bg-slate-50 animate-pulse my-8 rounded-sm" />
);

const SignatureProduct = dynamic(
  () => import('./sections/SignatureProduct').then((mod) => mod.SignatureProduct),
  { loading: () => <SectionSkeleton /> }
);

const ShopTheLook = dynamic(
  () => import('./sections/ShopTheLook').then((mod) => mod.ShopTheLook),
  { loading: () => <SectionSkeleton /> }
);

const AccessoriesSection = dynamic(
  () => import('./sections/AccessoriesSection').then((mod) => mod.AccessoriesSection),
  { loading: () => <SectionSkeleton /> }
);

const QualitySection = dynamic(
  () => import('./sections/QualitySection').then((mod) => mod.QualitySection),
  { loading: () => <SectionSkeleton /> }
);

const BlogSection = dynamic(
  () => import('./sections/BlogSection').then((mod) => mod.BlogSection),
  { loading: () => <SectionSkeleton /> }
);

const CTABanner = dynamic(
  () => import('./sections/CTABanner').then((mod) => mod.CTABanner),
  { loading: () => <div className="w-full h-64 bg-slate-100 animate-pulse" /> }
);

interface HomePageClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialHomeData: HomeSettings;
}

export default function HomePageClient({ initialProducts, initialCategories, initialHomeData }: HomePageClientProps) {
  // Tách settings ra biến để code gọn hơn
  const categorySettings = {
    headingNormal: initialHomeData.categoryHeadingNormal,
    headingHighlight: initialHomeData.categoryHeadingHighlight,
    subheading: initialHomeData.categorySubheading,
    catalogueText: initialHomeData.catalogueText,
    enableNofollow: initialHomeData.enableCategoryNofollow
  };

  const signatureSettings = {
    headingNormal: initialHomeData.signatureHeadingNormal,
    headingHighlight: initialHomeData.signatureHeadingHighlight,
    description: initialHomeData.signatureDesc,
    tabs: initialHomeData.signatureTabs
  };

  const shopLookSettings = {
    heading: initialHomeData.shopLookHeading,
    subheading: initialHomeData.shopLookSubheading,
    image: initialHomeData.shopLookImage,
    items: initialHomeData.shopLookItems || []
  };

  const accSettings = {
    highlights: initialHomeData.accHighlights || [],
    viewAll: initialHomeData.accViewAll,
    prodHeading: initialHomeData.accProdHeading,
    products: initialHomeData.accProducts || [],
    headNormal: initialHomeData.headNormal || 'Chi Tiết.',
    headHighlight: initialHomeData.headHighlight || 'Định Hình Đẳng Cấp.',
    phuKienSub: initialHomeData.phuKienSub,
  };

  const qualitySettings = {
    heading: initialHomeData.qualityHeading,
    subheading: initialHomeData.qualitySubheading,
    large: initialHomeData.qualityLarge,
    small: initialHomeData.qualitySmall
  };

  const blogPosts = initialHomeData.blogPosts || [];

  return (
    <div className="animate-fade-in bg-white font-sans selection:bg-brand-900 selection:text-white">
      
      {/* 1. HERO SECTION - Critical LCP Element */}
      <HeroSection slides={initialHomeData.heroSlides} />

      {/* 2. CATEGORY STRIP - Critical Navigation */}
      <CategoryShowcase 
         categories={initialCategories} 
         settings={categorySettings} 
      />

      {/* 3. DYNAMIC SECTIONS - Chỉ load khi user cuộn trang */}
      <SignatureProduct settings={signatureSettings} />

      <ShopTheLook settings={shopLookSettings} />

      <AccessoriesSection settings={accSettings} />

      <QualitySection settings={qualitySettings} />

      <BlogSection posts={blogPosts} />

      <CTABanner />

    </div>
  );
}