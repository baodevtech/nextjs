'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, HomeSettings } from '@/types';
import { CategoryShowcase } from './sections/CategoryShowcase';

// Import các section con đã tách
import { HeroSection } from './sections/HeroSection';
import { SignatureProduct } from './sections/SignatureProduct';
import { ShopTheLook } from './sections/ShopTheLook';
import { AccessoriesSection } from './sections/AccessoriesSection';
import { QualitySection } from './sections/QualitySection';
import { BlogSection } from './sections/BlogSection';
import { CTABanner } from './sections/CTABanner';

interface HomePageClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialHomeData: HomeSettings;
}

export default function HomePageClient({ initialProducts, initialCategories, initialHomeData }: HomePageClientProps) {
  // Vì HomePageClient nhận props từ server component (page.tsx)
  // nên ta có thể dùng trực tiếp, hoặc lưu vào state nếu cần lọc/thay đổi ở client
  // Ở đây tôi dùng trực tiếp để đơn giản hoá, nhưng vẫn giữ state nếu bạn muốn fetch lại.
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [homeSettings] = useState<HomeSettings>(initialHomeData);
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
    tabs: initialHomeData.signatureTabs // Truyền mảng tabs xuống
  };
  const shopLookSettings = {
    heading: initialHomeData.shopLookHeading,
    subheading: initialHomeData.shopLookSubheading,
    image: initialHomeData.shopLookImage,
    items: initialHomeData.shopLookItems || []
  };
  // [MỚI] Settings cho Accessories
  const accSettings = {
    highlights: initialHomeData.accHighlights || [],
    viewAll: initialHomeData.accViewAll,
    prodHeading: initialHomeData.accProdHeading,
    products: initialHomeData.accProducts || [],
    headNormal: initialHomeData.accHeadNormal || 'Chi Tiết.',
    headHighlight: initialHomeData.accHeadHighlight || 'Định Hình Đẳng Cấp.',
    phuKienSub: initialHomeData.accphuKienSub || ' Hệ thống phụ kiện nẹp, phào chỉ và keo dán chuyên dụng được thiết kế đồng bộ để tạo nên sự hoàn hảo cho từng góc cạnh.',
  };
  return (
    <div className="animate-fade-in bg-white font-sans selection:bg-brand-900 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <HeroSection slides={homeSettings.heroSlides} />

      {/* 2. CATEGORY STRIP */}
      <CategoryShowcase 
         categories={categories} 
         settings={categorySettings} 
      />

      {/* 3. SIGNATURE COLLECTION */}
      <SignatureProduct settings={signatureSettings} />

      {/* 4. SHOP THE LOOK */}
      <ShopTheLook settings={shopLookSettings} />

      {/* 5. ACCESSORIES */}
     <AccessoriesSection settings={accSettings} />

      {/* 6. QUALITY STANDARDS */}
      <QualitySection />

      {/* 7. BLOG */}
      <BlogSection />

      {/* 8. CTA BANNER */}
      <CTABanner />

    </div>
  );
}