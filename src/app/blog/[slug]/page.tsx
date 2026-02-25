import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Facebook, Twitter, Linkedin, Share2, Tag, ChevronRight } from 'lucide-react';
import { getPostBySlug, getAllPosts } from '@/services/wpService';
import { TableOfContents } from '@/components/blog/TableOfContents';

interface Props {
  params: Promise<{ slug: string }>;
}

// Helper: Tạo ID cho thẻ Heading
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

// Helper: Xử lý HTML
const processContentWithTOC = (htmlContent: string) => {
  const regex = /<(h[2-3])>(.*?)<\/\1>/g;
  const toc: { id: string; text: string; level: string }[] = [];
  
  const processedContent = htmlContent.replace(regex, (match, tag, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '');
    const id = slugify(cleanText);
    toc.push({ id, text: cleanText, level: tag });
    return `<${tag} id="${id}" class="scroll-mt-24 md:scroll-mt-32">${text}</${tag}>`;
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

  const { processedContent, toc } = processContentWithTOC(post.content);

  const wordCount = post.content.split(/\s+/g).length;
  const readTime = `${Math.ceil(wordCount / 200)} phút đọc`;

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
    <div className="bg-white min-h-screen font-sans pb-16 md:pb-20 animate-fade-in scroll-smooth">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* =========================================
          1. HEADER HERO (Tối ưu Mobile gọn gàng)
      ========================================= */}
      <div className="bg-slate-50 pt-24 md:pt-32 pb-8 md:pb-12 border-b border-gray-100 px-4 sm:px-6 lg:px-8">
           <div className="max-w-7xl mx-auto">
               <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-slate-500 mb-4 md:mb-6 uppercase tracking-wider font-medium">
                  <Link href="/blog" className="hover:text-amber-600">Blog</Link>
                  <ChevronRight size={12} />
                  <span className="text-amber-600">{post.category}</span>
               </nav>

               <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 mb-5 md:mb-6 leading-snug md:leading-tight max-w-4xl">
                  {post.title}
               </h1>
               
               {/* Metadata (Avatar, Ngày, Giờ đọc) */}
               <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-slate-500">
                   <div className="flex items-center gap-2 md:gap-3">
                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white shadow-sm overflow-hidden bg-gray-200 shrink-0">
                           <img src={post.author.avatar || 'https://via.placeholder.com/100'} alt={post.author.name} className="w-full h-full object-cover" />
                       </div>
                       <div>
                           <p className="font-bold text-slate-900 leading-tight">{post.author.name}</p>
                           <p className="text-[10px] md:text-xs">Tác giả</p>
                       </div>
                   </div>
                   
                   {/* Dùng Divider dạng chấm tròn trên mobile thay vì bọc box để tiết kiệm diện tích */}
                   <div className="hidden md:block w-px h-6 bg-gray-200"></div>
                   
                   <div className="flex items-center gap-1.5 md:gap-2 md:bg-white md:px-3 md:py-1 md:rounded-full md:border md:border-gray-200">
                       <Calendar size={14} className="text-amber-500 md:w-4 md:h-4" /> 
                       <span>{post.date}</span>
                   </div>
                   
                   <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 md:hidden"></div>
                   
                   <div className="flex items-center gap-1.5 md:gap-2 md:bg-white md:px-3 md:py-1 md:rounded-full md:border md:border-gray-200">
                       <Clock size={14} className="text-amber-500 md:w-4 md:h-4" /> 
                       <span>{readTime}</span>
                   </div>
               </div>
           </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10 md:gap-12">
              
              {/* =========================================
                  2. LEFT: NỘI DUNG BÀI VIẾT
              ========================================= */}
              <main className="lg:w-3/4">
                  {/* Ảnh Cover */}
                  <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-sm mb-6 md:mb-10 aspect-[16/9] bg-slate-100">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>

                  {/* [MOBILE UX] MỤC LỤC XUẤT HIỆN TRÊN CÙNG BÀI VIẾT */}
                  <div className="block lg:hidden mb-8">
                      <TableOfContents toc={toc} />
                  </div>

                  {/* Nội dung Prose */}
                  <article 
                      className="prose prose-base md:prose-lg prose-slate max-w-none 
                      prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-8 md:prose-headings:mt-10 prose-headings:mb-4
                      prose-p:text-slate-600 prose-p:leading-relaxed md:prose-p:leading-8 prose-p:mb-5 md:prose-p:mb-6
                      prose-a:text-amber-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-lg md:prose-img:rounded-xl prose-img:shadow-sm md:prose-img:shadow-md prose-img:border prose-img:border-gray-100 prose-img:my-6 md:prose-img:my-8
                      prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-gray-50 prose-blockquote:py-3 md:prose-blockquote:py-4 prose-blockquote:px-4 md:prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-slate-700"
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                  />

                  {/* Tags & Chia sẻ */}
                  <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 md:gap-6">
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                          <Tag size={16} className="text-slate-400 mr-1 md:w-[18px] md:h-[18px]" />
                          {post.tags && post.tags.length > 0 ? (
                              post.tags.map((tag, index) => (
                                <Link 
                                    key={index} 
                                    href={`/blog?search=${encodeURIComponent(tag)}`}
                                    className="px-2.5 py-1 bg-gray-100 text-slate-600 text-xs md:text-sm font-medium rounded hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                >
                                    #{tag}
                                </Link>
                              ))
                          ) : (
                              <span className="px-2.5 py-1 bg-gray-100 text-slate-600 text-xs md:text-sm font-medium rounded">
                                  {post.category}
                              </span>
                          )}
                      </div>
                      
                      {/* Share Buttons */}
                      <div className="flex items-center gap-2.5 md:gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
                          <span className="text-xs md:text-sm font-bold text-slate-500 mr-1 md:mr-2">Chia sẻ:</span>
                          <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Facebook size={14} className="md:w-4 md:h-4"/></button>
                          <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors"><Twitter size={14} className="md:w-4 md:h-4"/></button>
                          <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"><Linkedin size={14} className="md:w-4 md:h-4"/></button>
                          <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"><Share2 size={14} className="md:w-4 md:h-4"/></button>
                      </div>
                  </div>
              </main>

              {/* =========================================
                  3. RIGHT: SIDEBAR (HOẶC BOTTOM TRÊN MOBILE)
              ========================================= */}
              <aside className="lg:w-1/4 space-y-6 md:space-y-8">
                  {/* Author Box - Trên mobile coi như phần Giới thiệu tác giả cuối bài */}
                  <div className="bg-slate-50 lg:bg-white p-5 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-3 md:mb-4 border-2 border-amber-100 overflow-hidden bg-gray-100">
                          <img src={post.author.avatar || 'https://via.placeholder.com/100'} alt={post.author.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base md:text-lg">{post.author.name}</h3>
                      <p className="text-[10px] md:text-xs text-amber-600 font-bold uppercase tracking-widest mb-2 md:mb-3 mt-1">Chuyên Gia Nội Thất</p>
                      <button className="text-xs md:text-sm font-bold text-slate-500 hover:text-amber-600 hover:underline transition-colors">Xem hồ sơ</button>
                  </div>

                  <div className="lg:sticky lg:top-32 space-y-6 md:space-y-8">
                      {/* [MOBILE UX] ẨN MỤC LỤC NÀY VÌ ĐÃ HIỂN THỊ Ở TRÊN */}
                      <div className="hidden lg:block">
                          <TableOfContents toc={toc} />
                      </div>

                      {/* CTA Box */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-2xl p-5 md:p-6 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                          <h4 className="font-bold text-base md:text-lg mb-1.5 md:mb-2 relative z-10">Cần tư vấn ngay?</h4>
                          <p className="text-slate-300 text-xs md:text-sm mb-4 relative z-10 leading-relaxed">Nhận báo giá thi công trọn gói cho công trình của bạn.</p>
                          <a href="https://zalo.me/YOUR_ZALO_NUMBER" target="_blank" rel="noreferrer" className="block w-full py-2.5 md:py-3 bg-amber-500 text-slate-900 text-sm text-center font-bold uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-colors shadow-lg relative z-10">
                              Liên hệ Zalo
                          </a>
                      </div>
                  </div>
              </aside>

          </div>

          {/* =========================================
              4. BÀI VIẾT LIÊN QUAN 
              (Kéo ra ngoài để thứ tự Mobile đúng UX)
          ========================================= */}
          {relatedPosts.length > 0 && (
              <div className="mt-12 md:mt-20 pt-10 md:pt-12 border-t border-gray-100">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 border-l-4 border-amber-500 pl-3 md:pl-4">Bài viết liên quan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      {relatedPosts.map(p => (
                          <Link key={p.id} href={`/blog/${p.slug}`} className="group flex flex-row gap-3 md:gap-4 bg-white md:bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all">
                              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shrink-0 bg-slate-200 relative">
                                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-[10px] md:text-xs font-bold text-amber-600 uppercase mb-1 truncate">{p.category}</p>
                                  <h4 className="font-bold text-sm md:text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">{p.title}</h4>
                                  <p className="text-[10px] md:text-xs text-slate-500 mt-1.5 md:mt-2">{p.date}</p>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}