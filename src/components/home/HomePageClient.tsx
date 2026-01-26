'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
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
}

export default function HomePageClient({ initialProducts, initialCategories }: HomePageClientProps) {
  // Vì HomePageClient nhận props từ server component (page.tsx)
  // nên ta có thể dùng trực tiếp, hoặc lưu vào state nếu cần lọc/thay đổi ở client
  // Ở đây tôi dùng trực tiếp để đơn giản hoá, nhưng vẫn giữ state nếu bạn muốn fetch lại.
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);

  return (
    <div className="animate-fade-in bg-white font-sans selection:bg-brand-900 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CATEGORY STRIP */}
      <CategoryShowcase categories={categories} />

      {/* 3. SIGNATURE COLLECTION */}
      <SignatureProduct products={products} />

      {/* 4. SHOP THE LOOK */}
      <ShopTheLook />

      {/* 5. ACCESSORIES */}
      <AccessoriesSection products={products} />

      {/* 6. QUALITY STANDARDS */}
      <QualitySection />

      {/* 7. BLOG */}
      <BlogSection />

      {/* 8. CTA BANNER */}
      <CTABanner />

    </div>
  );
}