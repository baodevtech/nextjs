// src/app/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { getProducts, getCategories, getHomeData, getUniversalSEO } from '@/services/wpService';
import HomePageClient from '@/components/home/HomePageClient';
// 1. TỐI ƯU SEO: Gọi API lấy dữ liệu Meta từ RankMath cho trang chủ (URI là "/")
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getUniversalSEO('/'); 
  const seo = seoData?.seo;

  // Fallback an toàn nếu API lỗi hoặc chưa cấu hình SEO bên WP
  if (!seo) {
    return {
      title: 'Tấm Ốp Tường & Lam Sóng Cao Cấp | Đại Nam Wall',
      description: 'Đại Nam Wall chuyên thi công và phân phối tấm ốp tường PVC, lam sóng giả gỗ, tấm ốp than tre. Báo giá tận xưởng, bảo hành 15 năm.',
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.focusKeywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      url: seo.openGraph?.url,
      siteName: seo.openGraph?.siteName,
      type: (seo.openGraph?.type as any) || 'website',
      locale: seo.openGraph?.locale || 'vi_VN',
      images: seo.openGraph?.image?.secureUrl ? [{ url: seo.openGraph.image.secureUrl, type: seo.openGraph.image.type }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      images: seo.openGraph?.image?.secureUrl ? [seo.openGraph.image.secureUrl] : [],
    },
    robots: {
      index: seo.robots?.includes('index'),
      follow: seo.robots?.includes('follow'),
    },
  };
}

export default async function HomePage() {
  // Fetch dữ liệu song song để tăng tốc độ load trang
  const [products, categories, homeData, seoNode] = await Promise.all([
    getProducts(), 
    getCategories(),
    getHomeData(),
    getUniversalSEO('/') // Lấy data SEO cho Schema
  ]);
  // Lấy chuỗi JSON-LD thô (Raw) từ RankMath
  const schemaRaw = seoNode?.seo?.jsonLd?.raw || null;

  return (
    <>
      {/* 2. TỐI ƯU SEO: Chèn Schema JSON-LD trực tiếp từ RankMath */}
      {schemaRaw && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaRaw }}
        />
      )}
      
      {/* 3. TỐI ƯU SEO: Thẻ H1 duy nhất, ẩn với người dùng nhưng hiển thị với Bot */}
      <h1 className="sr-only">
        {seoNode?.title || 'Đại Nam Wall - Tổng kho tấm ốp tường, lam sóng giả gỗ và PVC vân đá cao cấp'}
      </h1>

      {/* Truyền dữ liệu xuống Client Component */}
      <HomePageClient 
        initialProducts={products} 
        initialCategories={categories}
        initialHomeData={homeData}
      />
    </>
  );
}