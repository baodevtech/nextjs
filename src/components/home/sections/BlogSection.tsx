'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  // Nếu chưa có bài viết nào thì ẩn section này đi
  if (!posts || posts.length === 0) return null;

  // Tách bài viết: Bài đầu tiên là Featured, các bài sau là Side List
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 3);

  return (
      <section className="py-32 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* HEADER */}
              <div className="flex justify-between items-end mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Câu Chuyện Của Chúng Tôi.</h2>
                  <Link 
                    href="/blog" 
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all pb-1"
                  >
                      Đọc tất cả bài viết <ArrowRight size={16} />
                  </Link>
              </div>

              {/* GRID CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* 1. Featured Article (Cột Lớn) */}
                  <Link href={`/blog/${featuredPost.slug}`} className="lg:col-span-2 group cursor-pointer block">
                      <div className="aspect-[16/9] overflow-hidden rounded-3xl mb-6 relative">
                          <img 
                            src={featuredPost.image} 
                            alt={featuredPost.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          />
                          <div className="absolute top-6 left-6">
                              <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                                  Featured Story
                              </span>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                          <span className="text-amber-600">{featuredPost.category}</span>
                          <span>—</span>
                          <span>{featuredPost.date}</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-amber-600 transition-colors">
                          {featuredPost.title}
                      </h3>
                      <p className="text-slate-500 text-lg leading-relaxed max-w-2xl line-clamp-3">
                          {featuredPost.excerpt}
                      </p>
                  </Link>

                  {/* 2. Side List (Cột Nhỏ) */}
                  <div className="flex flex-col gap-10">
                      {sidePosts.map((post) => (
                          <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer block">
                              <div className="aspect-[3/2] overflow-hidden rounded-2xl mb-4">
                                  <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                  />
                              </div>
                              
                              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                  <span className="text-amber-600">{post.category}</span>
                                  {/* Dùng tên tác giả thay cho readTime vì WP mặc định không có readTime */}
                                  <span>{post.date}</span> 
                              </div>
                              
                              <h4 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                  {post.title}
                              </h4>
                          </Link>
                      ))}
                  </div>

              </div>
          </div>
      </section>
  );
};