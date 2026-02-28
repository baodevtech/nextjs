// src/app/blog/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { getPaginatedPosts, getBlogCategoriesList, getBlogTagsList } from '@/services/wpService';
import { BlogListClient } from '@/components/blog/BlogListClient'; 

export const metadata: Metadata = {
  title: 'Blog - Kiến Thức & Cảm Hứng Nội Thất | Đại Nam Wall',
  description: 'Cập nhật xu hướng thiết kế nội thất, hướng dẫn thi công tấm ốp tường và lam sóng.',
};

export default async function BlogPage() {
  // 1. Fetch dữ liệu trên Server ĐỒNG THỜI (Tối ưu tốc độ)
  const [initialData, categories, tags] = await Promise.all([
    getPaginatedPosts(5, ""), // Chỉ lấy 5 bài đầu
    getBlogCategoriesList(),
    getBlogTagsList()
  ]);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-600">
      
      {/* Hero Banner Static */}
      <section className="bg-slate-50 pt-8 pb-4 px-4 text-center md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
            <span className="text-amber-600 font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs mb-2 md:mb-4 block">
                Đại Nam Wall Blog
            </span>
            <h1 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 md:mb-5 leading-[1.2] md:leading-tight tracking-tight">
                Kiến Thức & Cảm Hứng<br className="hidden sm:block"/> Không Gian Sống
            </h1>
            <p className="text-[13px] sm:text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2 md:px-0">
                Nơi chia sẻ kinh nghiệm thi công, xu hướng thiết kế và những câu chuyện về vật liệu nội thất bền vững.
            </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         {/* Truyền dữ liệu vào Client Component */}
         <BlogListClient 
            initialPosts={initialData.posts} 
            initialPageInfo={initialData.pageInfo}
            categories={categories}
            tags={tags}
         />
      </div>
    </div>
  );
}