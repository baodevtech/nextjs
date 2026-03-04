// src/app/shop/page.tsx
import React, { Suspense } from "react";
import { Metadata } from "next";
import {
  getProducts,
  getCategories,
  getShopSettings,
  getUniversalSEO,
} from "@/services/wpService";
import ShopClient from "./ShopClient";

// 1. TỐI ƯU SEO: Sinh Meta Tag động từ RankMath cho trang Cửa hàng
export async function generateMetadata(): Promise<Metadata> {
  // Thay '/shop/' bằng URI thực tế trên WP của bạn (vd: '/cua-hang/' nếu bạn dùng tiếng Việt)
  const seoData = await getUniversalSEO('/shop/'); 
  const seo = seoData?.seo;

  if (!seo) {
    return { title: 'Cửa Hàng | Kho Panel Việt Nam' };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonicalUrl, // URL đã được wpService fix tự động sang domain frontend
    },
    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      url: seo.openGraph?.url,
      siteName: seo.openGraph?.siteName,
      type: (seo.openGraph?.type as any) || 'website',
      locale: seo.openGraph?.locale || 'vi_VN',
      images: seo.openGraph?.image?.secureUrl ? [{ url: seo.openGraph.image.secureUrl }] : [],
    },
    robots: {
      index: seo.robots?.includes('index'),
      follow: seo.robots?.includes('follow'),
    },
  };
}

export default async function ShopPage() {
  // Lấy dữ liệu trên Server (Fetch song song kể cả data SEO)
  const [products, categories, shopSettings, seoNode] = await Promise.all([
    getProducts(),
    getCategories(),
    getShopSettings(),
    getUniversalSEO('/shop/') // Lấy thêm data SEO để chèn Schema JSON-LD
  ]);

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

      {/* 3. TỐI ƯU SEO: Thẻ H1 duy nhất dành cho Bot Google đọc (ẩn với người dùng) */}
      <h1 className="sr-only">
        {seoNode?.title || 'Danh mục sản phẩm Kho Panel'}
      </h1>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Đang tải cửa hàng...</div>}>
        <ShopClient 
          initialProducts={products}
          initialCategories={categories}
          initialShopSettings={shopSettings}
        />
      </Suspense>
    </>
  );
}