// src/app/product/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getUniversalSEO } from '@/services/wpService'; 
import ProductDetailClient from '@/components/product/ProductDetailClient';

// 1. TẠO METADATA ĐỘNG TỪ RANKMATH SEO
// Lấy chuẩn dữ liệu Title, Description, OpenGraph từ WordPress
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Tùy theo cấu hình permalink của bạn trên WP, URI có thể là `/product/${slug}/` hoặc `/san-pham/${slug}/`
  const seoData = await getUniversalSEO(`/product/${slug}/`);
  const seo = seoData?.seo;

  // Fallback an toàn: Nếu API SEO lỗi hoặc sản phẩm chưa có SEO, tự động render theo data gốc
  if (!seo) {
    const product = await getProductBySlug(slug);
    if (!product) {
      return {
        title: 'Sản phẩm không tìm thấy | Kho Panel',
        description: 'Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại.',
      };
    }

    const description = product.shortDescription || 
                        product.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || 
                        `Mua ${product.name} chính hãng tại Kho Panel.`;

   return {
      title: `${product.name} | Kho Panel`,
      description: description,
      openGraph: {
        title: product.name,
        description: description,
        images: [{ url: product.image?.sourceUrl }],
        type: 'website', 
      },
    };
  }

  // Trả về dữ liệu SEO chuẩn xác của RankMath
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonicalUrl },
    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      url: seo.openGraph?.url,
      siteName: seo.openGraph?.siteName,
      type: 'website',// Khai báo chuẩn đây là sản phẩm
      locale: seo.openGraph?.locale || 'vi_VN',
      images: seo.openGraph?.image?.secureUrl ? [{ url: seo.openGraph.image.secureUrl }] : [],
    },
    robots: { index: seo.robots?.includes('index'), follow: seo.robots?.includes('follow') }
  };
}

// 2. SERVER COMPONENT CHÍNH
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch dữ liệu song song (Lấy Sản phẩm + SEO Schema cùng lúc để tiết kiệm thời gian)
  const [product, seoNode] = await Promise.all([
    getProductBySlug(slug),
    getUniversalSEO(`/product/${slug}/`)
  ]);

  // Nếu không có sản phẩm, chuyển hướng sang trang 404
  if (!product) {
    notFound();
  }

  // Chuỗi Schema (JSON-LD) đã được wpService thay thế domain tự động
  const schemaRaw = seoNode?.seo?.jsonLd?.raw || null;

  return (
    <div className="bg-white min-h-screen font-sans animate-fade-in pb-20">
       
       {/* TỐI ƯU SEO: Chèn Schema JSON-LD từ RankMath */}
       {schemaRaw && (
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaRaw }} />
       )}

       {/* Breadcrumb - Render tĩnh để tốt cho cấu trúc link nội bộ (Internal Link) */}
       <div className="border-b border-gray-100 bg-white sticky top-0 z-30 lg:relative">
          <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-slate-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
             <Link href="/" className="hover:text-brand-600 transition-colors">Trang chủ</Link>
             <ChevronRight size={12} className="text-slate-300" />
             <Link href="/shop" className="hover:text-brand-600 transition-colors">Sản phẩm</Link>
             <ChevronRight size={12} className="text-slate-300" />
             {/* Bạn có thể bổ sung danh mục (Category) vào Breadcrumb nếu muốn */}
             <span className="text-slate-900 font-medium truncate">{product.name}</span>
          </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Truyền dữ liệu xuống Client Component để xử lý tương tác (chọn số lượng, thêm giỏ hàng...) */}
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
