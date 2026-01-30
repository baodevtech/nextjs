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
      <section className="pt-32 pb-16 bg-slate-50 border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-3 animate-slide-up">
                Đại Nam Wall Blog
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-slide-up leading-tight">
                Kiến Thức & Cảm Hứng <br className="hidden md:block" /> Không Gian Sống
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed animate-slide-up delay-100">
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