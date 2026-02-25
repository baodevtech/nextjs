import React from 'react';
import { Metadata } from 'next';
import { getAllPosts } from '@/services/wpService';
import { BlogListClient } from '@/components/blog/BlogListClient'; // Import Client Component

export const metadata: Metadata = {
  title: 'Blog - Kiến Thức & Cảm Hứng Nội Thất | Đại Nam Wall',
  description: 'Cập nhật xu hướng thiết kế nội thất, hướng dẫn thi công tấm ốp tường và lam sóng.',
};

export default async function BlogPage() {
  // 1. Fetch dữ liệu trên Server
  const posts = await getAllPosts();

  return (
    <div className="bg-white min-h-screen font-sans text-slate-600">
      
      {/* Hero Banner (Giữ nguyên Static) */}
     <section className="bg-slate-50 pt-8 pb-4 px-4 text-center md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 border-b border-slate-100">
    <div className="max-w-3xl mx-auto">
        
        {/* Eyebrow / Sub-title */}
        <span className="text-amber-600 font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs mb-2 md:mb-4 block">
            Đại Nam Wall Blog
        </span>

        {/* Main Title - Cực kỳ sát và gọn trên mobile */}
        <h1 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 md:mb-5 leading-[1.2] md:leading-tight tracking-tight">
            Kiến Thức & Cảm Hứng<br className="hidden sm:block"/> Không Gian Sống
        </h1>

        {/* Description - Giảm size, làm mờ nhẹ */}
        <p className="text-[13px] sm:text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2 md:px-0">
            Nơi chia sẻ kinh nghiệm thi công, xu hướng thiết kế và những câu chuyện về vật liệu nội thất bền vững.
        </p>
        
    </div>
</section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         {/* 2. Truyền dữ liệu xuống Client Component để xử lý tìm kiếm/lọc */}
         <BlogListClient posts={posts} />
      </div>
    </div>
  );
}