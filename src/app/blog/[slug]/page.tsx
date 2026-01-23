'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Facebook, Twitter, Linkedin, Share2, Tag, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '@/constants';
import { BlogPost } from '@/types';
import { SEO } from '@/components/common/SEO';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const foundPost = BLOG_POSTS.find(p => p.slug === params.slug);
    if (foundPost) {
        setPost(foundPost);
        setRelatedPosts(BLOG_POSTS.filter(p => p.id !== foundPost.id).slice(0, 3));
    }
    window.scrollTo(0, 0);
  }, [params.slug]);

  if (!post) return <div className="min-h-screen pt-32 text-center">Đang tải bài viết...</div>;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": [{
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Đại Nam Wall",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=200"
      }
    },
    "description": post.excerpt,
    "articleSection": post.category,
    "keywords": post.tags.join(", ")
  };

  return (
    <div className="bg-white min-h-screen font-sans animate-fade-in pb-20">
        
        <SEO 
            title={post.title}
            description={post.excerpt}
            image={post.image}
            type="article"
            schema={articleSchema}
        />

        <div className="bg-slate-50 pt-32 pb-12 border-b border-gray-100">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6 uppercase tracking-wider font-medium">
                    <Link href="/blog" className="hover:text-brand-600">Blog</Link>
                    <ChevronRight size={12} />
                    <span className="text-brand-600">{post.category}</span>
                 </nav>

                 <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight max-w-4xl">
                    {post.title}
                 </h1>
                 
                 <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                     <div className="flex items-center gap-3">
                         <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border border-white shadow-sm" />
                         <div>
                             <p className="font-bold text-slate-900">{post.author.name}</p>
                             <p className="text-xs">{post.author.role}</p>
                         </div>
                     </div>
                     <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                         <Calendar size={16} className="text-brand-500" /> {post.date}
                     </div>
                     <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                         <Clock size={16} className="text-brand-500" /> {post.readTime}
                     </div>
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                
                <main className="lg:w-3/4">
                    <div className="rounded-2xl overflow-hidden shadow-sm mb-10 aspect-video">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>

                    <article 
                        className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-10 prose-headings:mb-4
                        prose-p:text-slate-600 prose-p:leading-8 prose-p:mb-6
                        prose-a:text-brand-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-gray-100 prose-img:my-8
                        prose-strong:text-slate-900
                        prose-li:text-slate-600
                        prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-slate-700"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Tag size={18} className="text-slate-400" />
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-slate-600 text-sm rounded hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-500 mr-2">Chia sẻ:</span>
                            <button className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100" aria-label="Share on Facebook"><Facebook size={16}/></button>
                            <button className="w-9 h-9 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100" aria-label="Share on Twitter"><Twitter size={16}/></button>
                            <button className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100" aria-label="Share on LinkedIn"><Linkedin size={16}/></button>
                            <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200" aria-label="Copy Link"><Share2 size={16}/></button>
                        </div>
                    </div>

                    <div className="mt-16">
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 border-l-4 border-brand-500 pl-4">Bài viết liên quan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedPosts.map(p => (
                                <Link key={p.id} href={`/blog/${p.slug}`} className="group flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-brand-200 transition-all">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                        <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-600 uppercase mb-1">{p.category}</p>
                                        <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">{p.title}</h4>
                                        <p className="text-xs text-slate-500 mt-2">{p.date}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>

                <aside className="lg:w-1/4 space-y-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <img src={post.author.avatar} alt={post.author.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-brand-100" />
                        <h3 className="font-bold text-slate-900 text-lg">{post.author.name}</h3>
                        <p className="text-xs text-brand-600 font-bold uppercase tracking-widest mb-3">{post.author.role}</p>
                        <p className="text-slate-500 text-sm mb-4">Chuyên gia tư vấn vật liệu và giải pháp thi công nội thất.</p>
                        <button className="text-sm font-bold text-brand-600 hover:underline">Xem hồ sơ</button>
                    </div>

                    <div className="sticky top-28 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                        <h4 className="font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                            Mục lục
                        </h4>
                        <nav className="space-y-1">
                            <a href="#" className="block py-2 text-sm text-brand-600 font-medium border-l-2 border-brand-500 pl-3">1. Giới thiệu tổng quan</a>
                            <a href="#" className="block py-2 text-sm text-slate-600 hover:text-brand-600 border-l-2 border-transparent pl-3 transition-colors">2. Xu hướng vật liệu 2024</a>
                            <a href="#" className="block py-2 text-sm text-slate-600 hover:text-brand-600 border-l-2 border-transparent pl-3 transition-colors">3. Lưu ý khi thi công</a>
                            <a href="#" className="block py-2 text-sm text-slate-600 hover:text-brand-600 border-l-2 border-transparent pl-3 transition-colors">4. Kết luận</a>
                        </nav>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                        <h4 className="font-bold text-lg mb-2 relative z-10">Cần tư vấn ngay?</h4>
                        <p className="text-slate-300 text-sm mb-4 relative z-10">Nhận báo giá thi công trọn gói cho công trình của bạn.</p>
                        <button className="w-full py-3 bg-brand-600 font-bold rounded-lg hover:bg-brand-500 transition-colors shadow-lg relative z-10">
                            Liên hệ Zalo
                        </button>
                    </div>
                </aside>

            </div>
        </div>
    </div>
  );
};