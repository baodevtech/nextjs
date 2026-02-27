'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search, ChevronRight, Hash, Loader2, Filter } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogListClientProps {
  posts: BlogPost[];
}

export const BlogListClient: React.FC<BlogListClientProps> = ({ posts }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Data Processing (Giữ nguyên logic)
  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [posts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).slice(0, 15);
  }, [posts]);

  const featuredSidebarPosts = posts.slice(0, 3);

  const filteredPosts = posts.filter(post => {
    const matchCategory = filter === 'All' || post.category === filter;
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                        post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTag ? post.tags?.includes(selectedTag) : true;
    return matchCategory && matchSearch && matchTag;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(5);
  }, [filter, search, selectedTag]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
        setVisibleCount(prev => prev + 5);
        setIsLoading(false);
    }, 400);
  };

  return (
    <div className="animate-fade-in">
        
        {/* =========================================
            MOBILE UX: THANH ĐIỀU HƯỚNG TINH GIẢN
            (Chỉ hiển thị trên Mobile/Tablet)
        ========================================= */}
        <div className="lg:hidden mb-6 flex flex-col gap-3">
            
            {/* 1. Mobile Search (Dáng bo tròn thanh thoát) */}
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm bài viết..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* 2. Mobile Categories (Pills nhỏ gọn) */}
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {categories.map(cat => (
                    <button 
                        key={`mobile-cat-${cat}`}
                        onClick={() => setFilter(cat)}
                        className={`snap-start whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            filter === cat 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 active:bg-slate-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 3. Mobile Tags (Ultra-compact) */}
            {allTags.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center">
                    <div className="text-[10px] font-bold uppercase text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                        <Filter size={12}/> Tags
                    </div>
                    {allTags.map(tag => {
                        const isActive = selectedTag === tag;
                        return (
                            <button 
                                key={`mobile-tag-${tag}`}
                                onClick={() => setSelectedTag(isActive ? null : tag)}
                                className={`snap-start whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                    isActive 
                                    ? 'bg-amber-100 text-amber-700 font-bold' 
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                #{tag}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

        {/* =========================================
            MAIN LAYOUT
        ========================================= */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
            
            {/* CỘT TRÁI: DANH SÁCH BÀI VIẾT */}
            <main className="lg:w-2/3">
                 {visiblePosts.length > 0 ? (
                    <div className="space-y-10 md:space-y-12">
                        {visiblePosts.map(post => (
                            <article key={post.id} className="flex flex-col group border-b border-gray-100 pb-10 md:pb-12 last:border-0 last:pb-0">
                                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl aspect-[16/9] mb-5 md:mb-6 shadow-sm relative">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                </Link>
                                
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">{post.category}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} className="md:w-3.5 md:h-3.5"/> {post.date}</span>
                                    <span className="flex items-center gap-1 hidden sm:flex"><Clock size={14} className="md:w-3.5 md:h-3.5"/> {post.readTime || '5'}</span>
                                </div>

                                <Link href={`/blog/${post.slug}`} className="group-hover:text-amber-700 transition-colors">
                                    <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4 leading-tight">
                                        {post.title}
                                    </h2>
                                </Link>
                                
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-5 md:mb-6 line-clamp-3 md:line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-100">
                                            <img src={post.author.avatar || 'https://via.placeholder.com/100'} alt={post.author.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs md:text-sm font-bold text-slate-900">{post.author.name}</span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors">
                                        Đọc tiếp <ArrowRight size={16} className="md:w-4 md:h-4"/>
                                    </Link>
                                </div>
                            </article>
                        ))}

                        {/* Nút Load More */}
                        {visibleCount < filteredPosts.length && (
                            <div className="mt-8 md:mt-12 text-center border-t border-gray-100 pt-8 md:pt-10">
                                <button 
                                    onClick={handleLoadMore} 
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-slate-700 hover:border-amber-500 hover:text-amber-600 hover:shadow-md transition-all min-w-[200px] text-sm md:text-base w-full sm:w-auto"
                                >
                                    {isLoading ? (
                                        <><Loader2 size={18} className="animate-spin"/> Đang tải...</>
                                    ) : (
                                        <>Xem thêm bài viết <ChevronRight size={18}/></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 px-4 bg-slate-50 rounded-2xl md:rounded-3xl border border-dashed border-slate-200">
                        <Search size={40} className="text-slate-300 mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-2">Không tìm thấy bài viết</h3>
                        <p className="text-xs md:text-sm text-slate-500 mb-6 max-w-sm">Rất tiếc, không có bài viết nào khớp với từ khóa hoặc bộ lọc hiện tại của bạn.</p>
                        <button 
                            onClick={() => {setFilter('All'); setSearch(''); setSelectedTag(null);}} 
                            className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-amber-600 shadow-sm hover:border-amber-200 hover:bg-amber-50 transition-all"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </main>

            {/* CỘT PHẢI: SIDEBAR */}
            <aside className="lg:w-1/3 space-y-8 md:space-y-10">
                
                {/* Desktop Search & Category (Ẩn trên Mobile vì đã có ở trên) */}
                <div className="hidden lg:block space-y-10">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-slate-900 text-lg mb-4">Tìm kiếm</h3>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Nhập từ khóa..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
                            />
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-5 border-b border-gray-100 pb-3">Danh mục</h3>
                        <ul className="space-y-1.5">
                            {categories.map(cat => (
                                <li key={`desktop-cat-${cat}`}>
                                    <button 
                                        onClick={() => setFilter(cat)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                            filter === cat 
                                            ? 'bg-amber-50 text-amber-700 font-bold shadow-sm ring-1 ring-amber-500/20' 
                                            : 'hover:bg-slate-50 text-slate-600 font-medium'
                                        }`}
                                    >
                                        <span>{cat}</span>
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-full ${filter === cat ? 'bg-amber-100 text-amber-600' : 'bg-transparent text-slate-300'}`}>
                                            <ChevronRight size={14} />
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {allTags.length > 0 && (
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-5 border-b border-gray-100 pb-3">Tags phổ biến</h3>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => {
                                    const isActive = selectedTag === tag;
                                    return (
                                        <button 
                                            key={`desktop-tag-${tag}`} 
                                            onClick={() => setSelectedTag(isActive ? null : tag)}
                                            className={`flex items-center gap-1 px-3.5 py-2 border rounded-lg text-xs font-bold transition-all shadow-sm ${
                                                isActive 
                                                ? 'bg-amber-500 border-amber-500 text-white' 
                                                : 'bg-white border-gray-200 text-slate-600 hover:border-amber-400 hover:text-amber-600'
                                            }`}
                                        >
                                            <Hash size={12} className={isActive ? 'text-white/70' : 'text-slate-400'}/> {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phần dưới này hiển thị trên cả Mobile và Desktop */}
                
                {/* BÀI VIẾT NỔI BẬT */}
                <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-5 border-b border-gray-100 pb-3">Bài viết nổi bật</h3>
                    <div className="space-y-4 md:space-y-5">
                        {featuredSidebarPosts.map(post => (
                            <Link key={`featured-${post.id}`} href={`/blog/${post.slug}`} className="flex gap-4 group items-center bg-white p-2 rounded-xl hover:shadow-md transition-shadow">
                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 border border-slate-100 relative">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] uppercase font-bold text-amber-600 mb-1 block">
                                        {post.category}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <span className="text-[10px] md:text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                                        <Clock size={10}/> {post.date}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Newsletter */}
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[50px] -mr-16 -mt-16 opacity-40"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-500 rounded-full blur-[40px] -ml-10 -mb-10 opacity-30"></div>
                    
                    <h3 className="font-bold text-lg md:text-xl mb-2 relative z-10">Đăng ký bản tin</h3>
                    <p className="text-slate-400 text-xs md:text-sm mb-5 md:mb-6 relative z-10 leading-relaxed">Nhận thông báo về các xu hướng kiến trúc & nội thất mới nhất.</p>
                    
                    <div className="relative z-10">
                        <input 
                            type="email" 
                            placeholder="Nhập email của bạn..." 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 mb-3 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-sm" 
                        />
                        <button className="w-full py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 text-sm uppercase tracking-wider">
                            Đăng Ký Ngay
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
};