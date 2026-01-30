import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Facebook, Twitter, Linkedin, Share2, Tag, ChevronRight } from 'lucide-react';
import { getPostBySlug, getAllPosts } from '@/services/wpService';
import { TableOfContents } from '@/components/blog/TableOfContents'; // Import Component mới
import { CATEGORIES } from '@/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

// Helper: Tạo ID cho thẻ Heading (Tiếng Việt -> Slug)
const slugify = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// Helper: Xử lý HTML để gắn ID và tạo dữ liệu TOC
const processContentWithTOC = (htmlContent: string) => {
  const regex = /<(h[2-3])>(.*?)<\/\1>/g;
  const toc: { id: string; text: string; level: string }[] = [];
  
  const processedContent = htmlContent.replace(regex, (match, tag, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '');
    const id = slugify(cleanText);
    toc.push({ id, text: cleanText, level: tag });
    // Thêm class scroll-mt-32 để khi cuộn tới không bị Header che mất
    return `<${tag} id="${id}" class="scroll-mt-32">${text}</${tag}>`;
  });

  return { processedContent, toc };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Không tìm thấy bài viết' };
  
  return {
    title: `${post.title} | Đại Nam Wall`,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  // Xử lý nội dung và tạo TOC
  const { processedContent, toc } = processContentWithTOC(post.content);

  // Tính thời gian đọc
  const wordCount = post.content.split(/\s+/g).length;
  const readTime = `${Math.ceil(wordCount / 200)} phút đọc`;

  // Schema SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.date,
    "author": [{ "@type": "Person", "name": post.author.name }],
    "description": post.excerpt,
  };

  return (
    <div className="bg-white min-h-screen font-sans pb-20 animate-fade-in scroll-smooth">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* HEADER HERO */}
      <div className="bg-slate-50 pt-32 pb-12 border-b border-gray-100">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6 uppercase tracking-wider font-medium">
                  <Link href="/blog" className="hover:text-amber-600">Blog</Link>
                  <ChevronRight size={12} />
                  <span className="text-amber-600">{post.category}</span>
               </nav>

               <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight max-w-4xl">
                  {post.title}
               </h1>
               
               <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full border border-white shadow-sm overflow-hidden bg-gray-200">
                           <img src={post.author.avatar || 'https://via.placeholder.com/100'} alt={post.author.name} className="w-full h-full object-cover" />
                       </div>
                       <div>
                           <p className="font-bold text-slate-900">{post.author.name}</p>
                           <p className="text-xs">Tác giả</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                       <Calendar size={16} className="text-amber-500" /> {post.date}
                   </div>
                   <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                       <Clock size={16} className="text-amber-500" /> {readTime}
                   </div>
               </div>
           </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
              
              {/* --- LEFT: ARTICLE --- */}
              <main className="lg:w-3/4">
                  <div className="rounded-2xl overflow-hidden shadow-sm mb-10 aspect-video bg-slate-100">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>

                  <article 
                      className="prose prose-lg prose-slate max-w-none 
                      prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-10 prose-headings:mb-4
                      prose-p:text-slate-600 prose-p:leading-8 prose-p:mb-6
                      prose-a:text-amber-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-gray-100 prose-img:my-8
                      prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-slate-700"
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                  />

                  {/* [FIXED] Footer Tags: Hiển thị Tags thật từ bài viết */}
                  <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex flex-wrap items-center gap-2">
                          <Tag size={18} className="text-slate-400 mr-1" />
                          {post.tags && post.tags.length > 0 ? (
                              post.tags.map((tag, index) => (
                                <Link 
                                    key={index} 
                                    href={`/blog?search=${encodeURIComponent(tag)}`}
                                    className="px-3 py-1 bg-gray-100 text-slate-600 text-sm rounded hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                >
                                    #{tag}
                                </Link>
                              ))
                          ) : (
                              <span className="px-3 py-1 bg-gray-100 text-slate-600 text-sm rounded">
                                  {post.category}
                              </span>
                          )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-500 mr-2">Chia sẻ:</span>
                          <button className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"><Facebook size={16}/></button>
                          <button className="w-9 h-9 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100"><Twitter size={16}/></button>
                          <button className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100"><Linkedin size={16}/></button>
                          <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"><Share2 size={16}/></button>
                      </div>
                  </div>

                  {/* Related Posts */}
                  {relatedPosts.length > 0 && (
                      <div className="mt-16">
                          <h3 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-amber-500 pl-4">Bài viết liên quan</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {relatedPosts.map(p => (
                                  <Link key={p.id} href={`/blog/${p.slug}`} className="group flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-amber-200 transition-all">
                                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                                          <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                      </div>
                                      <div>
                                          <p className="text-xs font-bold text-amber-600 uppercase mb-1">{p.category}</p>
                                          <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">{p.title}</h4>
                                          <p className="text-xs text-slate-500 mt-2">{p.date}</p>
                                      </div>
                                  </Link>
                              ))}
                          </div>
                      </div>
                  )}
              </main>

              {/* --- RIGHT: SIDEBAR --- */}
              <aside className="lg:w-1/4 space-y-8">
                  {/* Author Box */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-amber-100 overflow-hidden bg-gray-100">
                          <img src={post.author.avatar || 'https://via.placeholder.com/100'} alt={post.author.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{post.author.name}</h3>
                      <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-3">Chuyên Gia Nội Thất</p>
                      <button className="text-sm font-bold text-amber-600 hover:underline">Xem hồ sơ</button>
                  </div>

                  <div className="sticky top-32 space-y-8">
                      {/* [FIXED] Mục Lục Động (Client Component) */}
                      <TableOfContents toc={toc} />

                      {/* CTA Box */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                          <h4 className="font-bold text-lg mb-2 relative z-10">Cần tư vấn ngay?</h4>
                          <p className="text-slate-300 text-sm mb-4 relative z-10">Nhận báo giá thi công trọn gói cho công trình của bạn.</p>
                          <button className="w-full py-3 bg-amber-600 font-bold rounded-lg hover:bg-amber-500 transition-colors shadow-lg relative z-10">
                              Liên hệ Zalo
                          </button>
                      </div>
                  </div>
              </aside>

          </div>
      </div>
    </div>
  );
}