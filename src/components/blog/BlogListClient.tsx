// src/components/blog/BlogListClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search, ChevronRight, Hash, Loader2, Filter } from 'lucide-react';
import { BlogPost } from '@/types';
import { fetchMorePostsAction } from '@/actions/blogActions';

interface BlogListClientProps {
  initialPosts: BlogPost[];
  initialPageInfo: { hasNextPage: boolean; endCursor: string };
  categories: string[];
  tags: string[];
}

export const BlogListClient: React.FC<BlogListClientProps> = ({ 
    initialPosts, 
    initialPageInfo,
    categories,
    tags: allTags
}) => {
  // State quản lý danh sách hiển thị
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  
  // State quản lý bộ lọc
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  
  // State UI
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Lấy 3 bài đầu tiên làm Sidebar
  const featuredSidebarPosts = initialPosts.slice(0, 3);

  // EFFECT: Gọi API mỗi khi Filter, Search hoặc Tag thay đổi
  useEffect(() => {
    const fetchFilteredPosts = async () => {
        setIsFiltering(true);
        // Gọi Server Action với con trỏ (cursor) rỗng để lấy trang đầu tiên của bộ lọc mới
        const data = await fetchMorePostsAction(5, "", filter, search, selectedTag);
        setPosts(data.posts);
        setPageInfo(data.pageInfo);
        setIsFiltering(false);
    };

    // Dùng kỹ thuật Debounce: Chờ 500ms sau khi người dùng ngừng gõ phím mới gọi API tìm kiếm
    const timeoutId = setTimeout(() => {
        fetchFilteredPosts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filter, search, selectedTag]);

  // Xử lý nút Load More
  const handleLoadMore = async () => {
    if (!pageInfo.hasNextPage || isLoading) return;
    
    setIsLoading(true);
    // Gọi tiếp trang 2, 3... dựa vào endCursor
    const data = await fetchMorePostsAction(5, pageInfo.endCursor, filter, search, selectedTag);
    
    // Nối mảng bài viết cũ với bài viết mới
    setPosts(prev => [...prev, ...data.posts]);
    setPageInfo(data.pageInfo);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in">
        {/* MOBILE UX: THANH ĐIỀU HƯỚNG */}
        <div className="lg:hidden mb-6 flex flex-col gap-3">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm bài viết..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                {categories.map(cat => (
                    <button 
                        key={`mobile-cat-${cat}`}
                        onClick={() => setFilter(cat)}
                        className={`snap-start whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            filter === cat ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {allTags.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden items-center">
                    <div className="text-[10px] font-bold uppercase text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                        <Filter size={12}/> Tags
                    </div>
                    {allTags.map(tag => {
                        const isActive = selectedTag === tag;
                        return (
                            <button 
                                key={`mobile-tag-${tag}`}
                                onClick={() => setSelectedTag(isActive ? '' : tag)}
                                className={`snap-start whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                    isActive ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-slate-50 text-slate-500'
                                }`}
                            >
                                #{tag}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
            
            {/* CỘT TRÁI: NỘI DUNG */}
            <main className="lg:w-2/3">
                {isFiltering ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                         <Loader2 size={32} className="animate-spin mb-4 text-amber-500"/>
                         <p>Đang tìm kiếm bài viết...</p>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-10 md:space-y-12">
                        {posts.map(post => (
                            <article key={post.id} className="flex flex-col group border-b border-gray-100 pb-10 md:pb-12 last:border-0 last:pb-0">
                                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl aspect-[16/9] mb-5 md:mb-6 shadow-sm relative">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </Link>
                                
                                <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs font-bold uppercase text-slate-400 mb-3">
                                    <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">{post.category}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14}/> {post.date}</span>
                                </div>

                                <Link href={`/blog/${post.slug}`} className="group-hover:text-amber-700 transition-colors">
                                    <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">{post.title}</h2>
                                </Link>
                                
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-slate-200">
                                            <img src={post.author.avatar || 'https://via.placeholder.com/100'} alt={post.author.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs md:text-sm font-bold text-slate-900">{post.author.name}</span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-xs md:text-sm font-bold text-amber-600 hover:text-amber-800">
                                        Đọc tiếp <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}

                        {/* Nút Load More Thực Sự */}
                        {pageInfo.hasNextPage && (
                            <div className="mt-8 md:mt-12 text-center border-t border-gray-100 pt-8 md:pt-10">
                                <button 
                                    onClick={handleLoadMore} 
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-slate-700 hover:border-amber-500 hover:text-amber-600 shadow-sm transition-all min-w-[200px]"
                                >
                                    {isLoading ? <><Loader2 size={18} className="animate-spin"/> Đang tải...</> : <>Xem thêm <ChevronRight size={18}/></>}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <Search size={40} className="text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy bài viết</h3>
                        <p className="text-sm text-slate-500 mb-6 max-w-sm text-center">Rất tiếc, không có bài viết nào khớp với từ khóa của bạn.</p>
                        <button onClick={() => {setFilter('All'); setSearch(''); setSelectedTag('');}} className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-amber-600 shadow-sm hover:border-amber-200">
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </main>

            {/* CỘT PHẢI: SIDEBAR */}
            <aside className="lg:w-1/3 space-y-10">
                <div className="hidden lg:block space-y-10">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-slate-900 text-lg mb-4">Tìm kiếm</h3>
                        <div className="relative">
                            <input 
                                type="text" placeholder="Nhập từ khóa..." value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10"
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
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${filter === cat ? 'bg-amber-50 text-amber-700 font-bold' : 'hover:bg-slate-50 font-medium'}`}
                                    >
                                        <span>{cat}</span><ChevronRight size={14} />
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
                                            key={`desktop-tag-${tag}`} onClick={() => setSelectedTag(isActive ? '' : tag)}
                                            className={`flex items-center gap-1 px-3.5 py-2 border rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-amber-500 border-amber-500 text-white' : 'hover:text-amber-600'}`}
                                        >
                                            <Hash size={12} className={isActive ? 'text-white/70' : 'text-slate-400'}/> {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* BÀI VIẾT NỔI BẬT */}
                <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-5 border-b border-gray-100 pb-3">Bài viết nổi bật</h3>
                    <div className="space-y-4 md:space-y-5">
                        {featuredSidebarPosts.map(post => (
                            <Link key={`sidebar-${post.id}`} href={`/blog/${post.slug}`} className="flex gap-4 group items-center">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 relative">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold text-amber-600 mb-1 block uppercase">{post.category}</span>
                                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors">{post.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
};