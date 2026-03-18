// src/app/shop/page.tsx
import React, { Suspense } from "react";
import { Metadata } from "next";
import {
  getPaginatedShopProducts,
  getCategories,
  getShopSettings,
  getUniversalSEO,
} from "@/services/wpService";
import ShopClient from "./ShopClient";

// 1. TỐI ƯU SEO: Sinh Meta Tag động từ RankMath cho trang Cửa hàng
export async function generateMetadata(): Promise<Metadata> {
  // Thay '/shop/' bằng URI thực tế trên WP của bạn (vd: '/cua-hang/' nếu bạn dùng tiếng Việt)
  const seoData = await getUniversalSEO('/c/'); 
  const seo = seoData?.seo;

  if (!seo) {
    return { title: 'Cửa Hàng | Kho Panel Việt Nam' };
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.focusKeywords,
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
    twitter: { // 👈 BỔ SUNG TWITTER
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

export default async function ShopPage() {
  // Lấy dữ liệu trên Server: 12 sản phẩm đầu tiên VÀ thông tin phân trang
  const paginatedData = await getPaginatedShopProducts(12, "", "all", "");
  const categories = await getCategories();
  const shopSettings = await getShopSettings();
  const seoNode = await getUniversalSEO('/c/'); 

  const schemaRaw = seoNode?.seo?.jsonLd?.raw || null;

  return (
    <>
      {schemaRaw && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaRaw }} />
      )}
      <h1 className="sr-only">
        {seoNode?.title || 'Danh mục sản phẩm'}
      </h1>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Đang tải cửa hàng...</div>}>
        <ShopClient 
          initialProducts={paginatedData.products}
          // 👉 DÒNG NÀY LÀ QUAN TRỌNG NHẤT ĐỂ FIX LỖI CLICK 2 LẦN
          initialPageInfo={paginatedData.pageInfo} 
          initialCategories={categories}
          initialShopSettings={shopSettings}
        />
      </Suspense>
    </>
  );
}