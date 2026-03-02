// src/app/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { getProducts, getCategories, getHomeData } from '@/services/wpService';
import HomePageClient from '@/components/home/HomePageClient';

// 1. TỐI ƯU SEO: Định nghĩa Metadata đầy đủ cho trang chủ
export const metadata: Metadata = {
  title: 'Tấm Ốp Tường & Lam Sóng Cao Cấp | Đại Nam Wall',
  description: 'Đại Nam Wall chuyên thi công và phân phối tấm ốp tường PVC, lam sóng giả gỗ, tấm ốp than tre. Báo giá tận xưởng, bảo hành 15 năm.',
  alternates: {
    canonical: 'https://tamnhuagiada.com', // Thay bằng domain thật của bạn
  },
  openGraph: {
    title: 'Đại Nam Wall | Tổng Kho Tấm Ốp Tường Cao Cấp',
    description: 'Giải pháp ốp tường sang trọng, bền bỉ cho không gian hiện đại. Cung cấp lam sóng, PVC vân đá, ốp than tre.',
    url: 'https://tamnhuagiada.com',
    siteName: 'Đại Nam Wall',
    images: [
      {
        url: '/images/og-homepage.jpg', // Cập nhật đường dẫn ảnh thực tế của bạn
        width: 1200,
        height: 630,
        alt: 'Đại Nam Wall - Tấm ốp tường cao cấp',
      }
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch dữ liệu song song
  const [products, categories, homeData] = await Promise.all([
    getProducts(), 
    getCategories(),
    getHomeData(), 
  ]);

  // 2. TỐI ƯU SEO: Khai báo Schema Markup (JSON-LD) cho Local Business / WebSite
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Đại Nam Wall",
    "image": "https://tamnhuagiada.com/logo.png", // Thay bằng logo thật
    "description": "Chuyên cung cấp vật liệu nội thất, tấm ốp tường, lam sóng cao cấp.",
    "url": "https://tamnhuagiada.com",
    "telephone": "0900000000", // Cập nhật số điện thoại
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ho Chi Minh City",
      "addressCountry": "VN"
    }
  };

  return (
    <>
      {/* Chèn Schema vào DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* 3. TỐI ƯU SEO: Thẻ H1 duy nhất, ẩn với người dùng nhưng hiển thị với Bot */}
      <h1 className="sr-only">
        Đại Nam Wall - Tổng kho tấm ốp tường, lam sóng giả gỗ và PVC vân đá cao cấp
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