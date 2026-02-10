// src/app/product/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug } from '@/services/wpService'; //
import ProductDetailClient from '@/components/product/ProductDetailClient';

// 1. TẠO METADATA ĐỘNG (SEO)
// Hàm này giúp Google hiểu được tiêu đề, mô tả và ảnh thumbnail của sản phẩm trước khi render
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy | Đại Nam Wall',
      description: 'Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại.',
    };
  }

  // Tự động lấy đoạn mô tả ngắn, nếu không có thì cắt từ mô tả dài
  const description = product.shortDescription || 
                      product.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || 
                      `Mua ${product.name} chính hãng tại Đại Nam Wall.`;

  return {
    title: `${product.name} | Đại Nam Wall`,
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      images: [
        {
          url: product.image.sourceUrl,
          width: 800,
          height: 600,
          alt: product.image.altText || product.name,
        },
      ],
      type: 'website',
    },
  };
}

// 2. SERVER COMPONENT CHÍNH
// Không dùng 'use client', fetch dữ liệu trực tiếp trên server
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch dữ liệu sản phẩm
  const product = await getProductBySlug(slug);

  // Nếu không có sản phẩm, chuyển hướng sang trang 404
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen font-sans animate-fade-in pb-20">
       {/* Breadcrumb - Render tĩnh để tốt cho cấu trúc link nội bộ (Internal Link) */}
       <div className="border-b border-gray-100 bg-white sticky top-0 z-30 lg:relative">
          <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-slate-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
             <Link href="/" className="hover:text-brand-600 transition-colors">Trang chủ</Link>
             <ChevronRight size={12} className="text-slate-300" />
             <Link href="/shop" className="hover:text-brand-600 transition-colors">Sản phẩm</Link>
             <ChevronRight size={12} className="text-slate-300" />
             <span className="text-slate-900 font-medium truncate">{product.name}</span>
          </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Truyền dữ liệu xuống Client Component để xử lý tương tác */}
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}