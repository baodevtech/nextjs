'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/constants';

export const BlogSection = () => {
  return (
      <section className="py-32 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-16">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">The Journal.</h2>
                  <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all pb-1">
                      Đọc tất cả bài viết <ArrowRight size={16} />
                  </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Featured Article */}
                  <div className="lg:col-span-2 group cursor-pointer">
                      <div className="aspect-[16/9] overflow-hidden rounded-3xl mb-6 relative">
                          <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                          <div className="absolute top-6 left-6">
                              <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">Featured Story</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                          <span className="text-brand-600">{BLOG_POSTS[0].category}</span>
                          <span>—</span>
                          <span>{BLOG_POSTS[0].date}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight group-hover:text-brand-600 transition-colors">{BLOG_POSTS[0].title}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">{BLOG_POSTS[0].excerpt}</p>
                  </div>

                  {/* Side List */}
                  <div className="flex flex-col gap-10">
                      {BLOG_POSTS.slice(1, 3).map((post) => (
                          <div key={post.id} className="group cursor-pointer">
                              <div className="aspect-[3/2] overflow-hidden rounded-2xl mb-4">
                                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              </div>
                              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                  <span className="text-brand-600">{post.category}</span>
                                  <span>{post.readTime}</span>
                              </div>
                              <h4 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h4>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>
  );
};