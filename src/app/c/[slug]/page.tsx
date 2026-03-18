// src/app/shop/[slug]/page.tsx
import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPaginatedShopProducts,
  getCategories,
  getShopSettings,
  getUniversalSEO,
} from "@/services/wpService";
import ShopClient from "@/app/c/ShopClient"; // Import lại Client Component từ trang Shop

// 1. TỐI ƯU SEO: Sinh Meta Tag động cho TỪNG DANH MỤC
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // LƯU Ý: Thay '/c/' bằng URL Base danh mục sản phẩm trên WordPress của bạn
  // Ví dụ WP của bạn là: portal.khopanel.com/shop/panel-pu/ thì để là `/shop/${slug}/`
  const seoData = await getUniversalSEO(`/c/${slug}/`); 
  const seo = seoData?.seo;

  if (!seo) {
    // Fallback nếu không gọi được SEO
    const categories = await getCategories();
    const currentCat = categories.find(c => c.slug === slug);
    return { title: `${currentCat?.name || 'Danh mục sản phẩm'} | Kho Panel` };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonicalUrl },
    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      url: seo.openGraph?.url,
      siteName: seo.openGraph?.siteName,
      type: 'website',
      locale: seo.openGraph?.locale || 'vi_VN',
      images: seo.openGraph?.image?.secureUrl ? [{ url: seo.openGraph.image.secureUrl }] : [],
    },
    robots: { index: seo.robots?.includes('index'), follow: seo.robots?.includes('follow') }
  };
}

// 2. SERVER COMPONENT
export default async function CategoryShopPage({ 
  params 
}: { 
  // 1. Định nghĩa lại kiểu dữ liệu là Promise
  params: Promise<{ slug: string }> 
}) {
   // 2. Thêm chữ await ở đây để mở gói params
   const { slug } = await params; 

   // Lấy dữ liệu cho danh mục cụ thể (truyền slug vào)
   const paginatedData = await getPaginatedShopProducts(12, "", slug, "");
  const categories = await getCategories();
  const shopSettings = await getShopSettings();
  const seoNode = await getUniversalSEO(`/c/${slug}/`);

  const currentCategory = categories.find(c => c.slug === slug);
  if (!currentCategory) {
    notFound();
  }

  const schemaRaw = seoNode?.seo?.jsonLd?.raw || null;

  return (
    <>
      {schemaRaw && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaRaw }} />
      )}
      
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Đang tải cửa hàng...</div>}>
        <ShopClient 
          initialProducts={paginatedData.products}
          // 👉 TRUYỀN BIẾN NÀY ĐỂ FIX LỖI 
          initialPageInfo={paginatedData.pageInfo} 
          initialCategories={categories}
          initialShopSettings={shopSettings}
          categorySlug={slug}
        />
      </Suspense>
    </>
  );
}