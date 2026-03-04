// src/app/shop/[slug]/page.tsx
import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProducts,
  getCategories,
  getShopSettings,
  getUniversalSEO,
} from "@/services/wpService";
import ShopClient from "@/app/shop/ShopClient"; // Import lại Client Component từ trang Shop

// 1. TỐI ƯU SEO: Sinh Meta Tag động cho TỪNG DANH MỤC
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // LƯU Ý: Thay '/shop/' bằng URL Base danh mục sản phẩm trên WordPress của bạn
  // Ví dụ WP của bạn là: portal.khopanel.com/shop/panel-pu/ thì để là `/shop/${slug}/`
  const seoData = await getUniversalSEO(`/shop/${slug}/`); 
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
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Lấy dữ liệu song song
  const [products, categories, shopSettings, seoNode] = await Promise.all([
    getProducts(),
    getCategories(),
    getShopSettings(),
    getUniversalSEO(`/shop/${slug}/`) // Lấy schema của danh mục
  ]);

  // Kiểm tra xem slug danh mục có tồn tại không, nếu không -> 404
  const currentCat = categories.find(c => c.slug === slug);
  if (!currentCat) {
    notFound();
  }

  const schemaRaw = seoNode?.seo?.jsonLd?.raw || null;

  return (
    <>
      {/* Chèn Schema JSON-LD từ RankMath */}
      {schemaRaw && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaRaw }} />
      )}

      {/* Thẻ H1 chuẩn SEO cho danh mục */}
      <h1 className="sr-only">
        {seoNode?.title || `Danh mục: ${currentCat.name}`}
      </h1>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải danh mục...</div>}>
        {/* Truyền thêm prop categorySlug để ShopClient biết cần active/filter danh mục nào ngay từ đầu */}
        <ShopClient 
          initialProducts={products}
          initialCategories={categories}
          initialShopSettings={shopSettings}
          categorySlug={slug} 
        />
      </Suspense>
    </>
  );
}