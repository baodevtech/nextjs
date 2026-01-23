'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search, ChevronRight, Hash } from 'lucide-react';
import { BLOG_POSTS } from '@/constants';
import { SEO } from '@/components/common/SEO';

export default function BlogPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map(post => post.category)))];
  const allTags = Array.from(new Set(BLOG_POSTS.flatMap(post => post.tags)));

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchCategory = filter === 'All' || post.category === filter;
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-white min-h-screen animate-fade-in font-sans text-slate-600">
      
      <SEO 
        title="Blog - Kiến Thức & Cảm Hứng Nội Thất"
        description="Cập nhật xu hướng thiết kế nội thất 2024, hướng dẫn thi công tấm ốp tường, lam sóng và các giải pháp vật liệu xanh từ Đại Nam Wall."
        type="website"
      />

      <section className="pt-32 pb-16 bg-slate-50 border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 animate-slide-up">
                Đại Nam Wall Blog
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 animate-slide-up leading-tight">
                Kiến Thức & Cảm Hứng <br className="hidden md:block" /> Không Gian Sống
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed animate-slide-up delay-100">
                Nơi chia sẻ kinh nghiệm thi công, xu hướng thiết kế và những câu chuyện về vật liệu nội thất bền vững.
            </p>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
            
            <main className="lg:w-2/3">
                {filteredPosts.length > 0 ? (
                    <div className="space-y-12">
                        {filteredPosts.map(post => (
                            <article key={post.id} className="flex flex-col group border-b border-gray-100 pb-12 last:border-0 last:pb-0">
                                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl aspect-[16/9] mb-6 shadow-sm">
                                     <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                     />
                                </Link>
                                
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    <span className="text-brand-600 bg-brand-50 px-2 py-1 rounded">{post.category}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime}</span>
                                </div>

                                <Link href={`/blog/${post.slug}`} className="group-hover:text-brand-700 transition-colors">
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight">
                                        {post.title}
                                    </h2>
                                </Link>
                                
                                <p className="text-slate-500 text-base leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                                        <span className="text-sm font-bold text-slate-900">{post.author.name}</span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors">
                                        Đọc tiếp <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-slate-500">Không tìm thấy bài viết nào phù hợp.</p>
                        <button onClick={() => {setFilter('All'); setSearch('')}} className="text-brand-600 font-bold mt-2 hover:underline">Xem tất cả bài viết</button>
                    </div>
                )}
                
                {filteredPosts.length > 0 && (
                    <div className="mt-16 flex justify-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 text-white font-bold">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-slate-600 hover:bg-gray-200 transition-colors">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-slate-600 hover:bg-gray-200 transition-colors">3</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-slate-600 hover:bg-gray-200 transition-colors"><ArrowRight size={16}/></button>
                    </div>
                )}
            </main>

            <aside className="lg:w-1/3 space-y-10">
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">Tìm kiếm</h3>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Nhập từ khóa..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        />
                        <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    </div>
                </div>

                <div>
                    <h3 className="font-serif font-bold text-slate-900 text-lg mb-6 border-b border-gray-100 pb-2">Danh mục</h3>
                    <ul className="space-y-2">
                        {categories.map(cat => (
                            <li key={cat}>
                                <button 
                                    onClick={() => setFilter(cat)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                                        filter === cat 
                                        ? 'bg-brand-50 text-brand-700 font-bold shadow-sm' 
                                        : 'hover:bg-gray-50 text-slate-600'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    {filter === cat && <ChevronRight size={16} />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-serif font-bold text-slate-900 text-lg mb-6 border-b border-gray-100 pb-2">Bài viết nổi bật</h3>
                    <div className="space-y-6">
                        {BLOG_POSTS.slice(0, 3).map(post => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-4 group">
                                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-brand-600 mb-1 block">{post.category}</span>
                                    <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-slate-400 mt-1 block">{post.date}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-serif font-bold text-slate-900 text-lg mb-6 border-b border-gray-100 pb-2">Tags phổ biến</h3>
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-colors shadow-sm">
                                <Hash size={12} /> {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-30"></div>
                     <h3 className="font-serif font-bold text-xl mb-2 relative z-10">Đăng ký bản tin</h3>
                     <p className="text-slate-400 text-sm mb-6 relative z-10">Nhận thông báo về các xu hướng thiết kế mới nhất.</p>
                     <input type="email" placeholder="Email của bạn" className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-500 mb-3 focus:outline-none focus:border-brand-500" />
                     <button className="w-full py-2.5 bg-brand-600 font-bold rounded-lg hover:bg-brand-500 transition-colors">Đăng Ký</button>
                </div>

            </aside>
        </div>
      </div>
    </div>
  );
};