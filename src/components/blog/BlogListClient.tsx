'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search, ChevronRight, Hash } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogListClientProps {
  posts: BlogPost[];
}

export const BlogListClient: React.FC<BlogListClientProps> = ({ posts }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // 1. Danh sách Categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [posts]);

  // 2. Danh sách Tags phổ biến (Lấy từ tất cả bài viết)
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).slice(0, 10); // Lấy tối đa 10 tags
  }, [posts]);

  // 3. Bài viết nổi bật (Lấy 3 bài đầu tiên làm ví dụ)
  const featuredSidebarPosts = posts.slice(0, 3);

  // Lọc bài viết hiển thị chính
  const filteredPosts = posts.filter(post => {
    const matchCategory = filter === 'All' || post.category === filter;
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                        post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-12">
        {/* MAIN CONTENT (Giữ nguyên) */}
        <main className="lg:w-2/3">
             {/* ... Code phần danh sách bài viết chính giữ nguyên ... */}
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
                                <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded">{post.category}</span>
                                <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> 5 phút đọc</span>
                            </div>

                            <Link href={`/blog/${post.slug}`} className="group-hover:text-amber-700 transition-colors">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                    {post.title}
                                </h2>
                            </Link>
                            
                            <p className="text-slate-500 text-base leading-relaxed mb-6 line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                                        <img src={post.author.avatar || 'https://via.placeholder.com/100'} alt={post.author.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{post.author.name}</span>
                                </div>
                                <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors">
                                    Đọc tiếp <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-slate-500">Không tìm thấy bài viết nào phù hợp.</p>
                    <button onClick={() => {setFilter('All'); setSearch('')}} className="text-amber-600 font-bold mt-2 hover:underline">Xem tất cả bài viết</button>
                </div>
            )}
        </main>

        {/* SIDEBAR */}
        <aside className="lg:w-1/3 space-y-10">
            {/* Search Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Tìm kiếm</h3>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Nhập từ khóa..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                    <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                </div>
            </div>

            {/* Category List */}
            <div>
                <h3 className="font-bold text-slate-900 text-lg mb-6 border-b border-gray-100 pb-2">Danh mục</h3>
                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat}>
                            <button 
                                onClick={() => setFilter(cat)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                                    filter === cat 
                                    ? 'bg-amber-50 text-amber-700 font-bold shadow-sm' 
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

            {/* [MỚI] BÀI VIẾT NỔI BẬT */}
            <div>
                <h3 className="font-bold text-slate-900 text-lg mb-6 border-b border-gray-100 pb-2">Bài viết nổi bật</h3>
                <div className="space-y-6">
                    {featuredSidebarPosts.map(post => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-4 group">
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-amber-600 mb-1 block">
                                    {post.category}
                                </span>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                                <span className="text-xs text-slate-400 mt-1 block">{post.date}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* [MỚI] TAGS PHỔ BIẾN */}
            {allTags.length > 0 && (
                <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-6 border-b border-gray-100 pb-2">Tags phổ biến</h3>
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button 
                                key={tag} 
                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-slate-600 hover:border-amber-500 hover:text-amber-600 transition-colors shadow-sm"
                            >
                                <Hash size={12} /> {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Newsletter */}
            <div className="bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-30"></div>
                <h3 className="font-bold text-xl mb-2 relative z-10">Đăng ký bản tin</h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10">Nhận thông báo về các xu hướng thiết kế mới nhất.</p>
                <input type="email" placeholder="Email của bạn" className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-500 mb-3 focus:outline-none focus:border-amber-500" />
                <button className="w-full py-2.5 bg-amber-600 font-bold rounded-lg hover:bg-amber-500 transition-colors">Đăng Ký</button>
            </div>
        </aside>
    </div>
  );
};