'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 3);

  return (
      // 1. SPACING: Giảm py-10 cho mobile (gọn hơn), giữ py-32 cho PC
      <section className="py-10 md:py-32 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* HEADER */}
              <div className="flex justify-between items-end mb-6 md:mb-16">
                  {/* Typography: Mobile text-2xl (nhỏ gọn), PC text-5xl */}
                  <h2 className="text-2xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                      Câu Chuyện <span className="inline md:block text-slate-400 md:text-slate-900">Của Chúng Tôi.</span>
                  </h2>
                  
                  {/* Link PC */}
                  <Link 
                    href="/blog" 
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all pb-1"
                  >
                      Đọc tất cả bài viết <ArrowRight size={16} />
                  </Link>
              </div>

              {/* GRID CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  
                  {/* --- 1. FEATURED POST (Cột Lớn) --- */}
                  <Link href={`/blog/${featuredPost.slug}`} className="lg:col-span-2 group cursor-pointer block">
                      {/* Image Ratio: Mobile 3/2, PC 16/9 */}
                      <div className="aspect-[3/2] md:aspect-[16/9] overflow-hidden rounded-xl md:rounded-3xl mb-3 md:mb-6 relative">
                          <img 
                            src={featuredPost.image} 
                            alt={featuredPost.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          />
                          <div className="absolute top-3 left-3 md:top-6 md:left-6">
                              <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] md:text-xs font-bold px-2 py-1 md:px-4 md:py-2 rounded-full uppercase tracking-wider shadow-sm">
                                  Nổi bật
                              </span>
                          </div>
                      </div>
                      
                      {/* Meta info */}
                      <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 md:mb-3">
                          <span className="text-amber-600">{featuredPost.category}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>{featuredPost.date}</span>
                      </div>
                      
                      {/* Title: Mobile text-xl (vừa vặn), PC text-4xl */}
                      <h3 className="text-xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-4 leading-tight group-hover:text-amber-600 transition-colors">
                          {featuredPost.title}
                      </h3>
                      
                      {/* Excerpt: Mobile text-xs (nhỏ), line-clamp-2 (ngắn gọn) */}
                      <p className="text-slate-500 text-xs md:text-lg leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-3">
                          {featuredPost.excerpt}
                      </p>
                  </Link>

                  {/* --- 2. SIDE LIST (Cột Phải) --- */}
                  <div className="flex flex-col gap-5 md:gap-10 border-t border-slate-100 pt-6 md:pt-0 md:border-0">
                      {sidePosts.map((post) => (
                          <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer flex md:block gap-3 md:gap-0 items-start">
                              
                              {/* Image Wrapper: Mobile w-20 (80px - rất gọn) */}
                              <div className="w-20 h-20 md:w-full md:h-auto aspect-square md:aspect-[3/2] overflow-hidden rounded-lg md:rounded-2xl md:mb-4 shrink-0 bg-slate-100">
                                  <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                  />
                              </div>
                              
                              {/* Content Wrapper */}
                              <div className="flex flex-col justify-center min-w-0">
                                  <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 md:mb-2">
                                      <span className="text-amber-600 truncate max-w-[80px]">{post.category}</span>
                                      <span className="hidden md:inline text-slate-300">•</span>
                                      <span className="hidden md:inline">{post.date}</span> 
                                  </div>
                                  
                                  {/* Title: Mobile text-sm (chuẩn list) */}
                                  <h4 className="text-sm md:text-xl font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2 md:line-clamp-2">
                                      {post.title}
                                  </h4>
                                  
                                  <span className="md:hidden text-[10px] text-slate-400 mt-0.5 font-medium">{post.date}</span>
                              </div>
                          </Link>
                      ))}
                  </div>

              </div>

              {/* 3. MOBILE FOOTER LINK */}
              <div className="mt-6 md:hidden text-center">
                   <Link 
                    href="/blog" 
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 hover:border-slate-900 pb-1 transition-all"
                  >
                      Đọc tất cả bài viết <ArrowRight size={14} />
                  </Link>
              </div>

          </div>
      </section>
  );
};