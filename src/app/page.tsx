'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, Star, CheckCircle2, MoveRight, 
    Layers, Box, ShieldCheck, PlayCircle, Quote, ArrowUpRight, 
    ChevronLeft, ChevronRight, PenTool, Calendar, User, Sparkles
} from 'lucide-react';
import { getProducts, getCategories } from '@/services/wpService';
import { Product, Category } from '@/types';
import { BLOG_POSTS } from '@/constants';
import { ProductCard } from '@/components/product/ProductComponents';
import { Button } from '@/components/common/UI';
import { useCart } from '@/context/CartContext';

// --- SUB-COMPONENT: BRAND MARQUEE ---
const BrandMarquee = () => (
    <div className="py-8 bg-white border-b border-gray-100 overflow-hidden">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Được tin dùng bởi các đối tác hàng đầu</p>
        <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee whitespace-nowrap flex gap-16 md:gap-32 px-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-xl md:text-2xl font-serif font-bold">VINHOMES</span>
                <span className="text-xl md:text-2xl font-serif font-bold">SUN GROUP</span>
                <span className="text-xl md:text-2xl font-serif font-bold">MASTERISE</span>
                <span className="text-xl md:text-2xl font-serif font-bold">NOVALAND</span>
                <span className="text-xl md:text-2xl font-serif font-bold">JW MARRIOTT</span>
                <span className="text-xl md:text-2xl font-serif font-bold">ECOPARK</span>
            </div>
        </div>
    </div>
);

// --- SUB-COMPONENT: REVIEWS (Dark Luxury Theme) ---
const REVIEWS = [
    {
        id: 1,
        name: "KTS. Hoàng Minh",
        role: "Giám đốc sáng tạo, MH Design",
        avatar: "MH",
        content: "Là một kiến trúc sư, tôi cực kỳ khắt khe về vật liệu. Đại Nam Wall không chỉ đáp ứng được tính thẩm mỹ tinh tế của vân đá mà còn giải quyết bài toán chống ẩm mốc nan giải tại các biệt thự mặt đất.",
        rating: 5,
        project: "Vinhomes Riverside"
    },
    {
        id: 2,
        name: "Chị Thanh Hằng",
        role: "Chủ chuỗi Spa Sen Mộc",
        avatar: "TH",
        content: "Tôi cần thi công nhanh để kịp ngày khai trương Spa. Đội ngũ Đại Nam đã hoàn thiện 200m2 ốp tường chỉ trong 2 ngày. Không bụi bặm, không mùi, khách hàng của tôi rất khen không gian sang trọng.",
        rating: 5,
        project: "Sen Mộc Spa, Hà Nội"
    },
    {
        id: 3,
        name: "Anh Đức Thịnh",
        role: "Căn hộ Penthouse Westlake",
        avatar: "ĐT",
        content: "Sản phẩm tấm ốp than tre thực sự ấn tượng. Khả năng uốn cong tại các góc bo tròn cột nhà rất mượt mà. Cảm ơn Đại Nam đã tư vấn giải pháp này cho gia đình tôi.",
        rating: 5,
        project: "Penthouse Tây Hồ"
    }
];

const ReviewSection = () => (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-4 text-amber-500">
                        <Star size={20} fill="currentColor" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] font-sans">Khách hàng nói gì</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                        Niềm tin được khẳng định <br/> qua chất lượng công trình.
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {REVIEWS.map((review) => (
                    <div key={review.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-amber-500/50 transition-colors duration-300 group">
                        <div className="flex justify-between items-start mb-6">
                            <Quote size={32} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                            <div className="flex gap-1 text-amber-500">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                        </div>
                        
                        <p className="text-slate-300 font-sans font-light leading-relaxed mb-8 min-h-[100px] italic">
                            "{review.content}"
                        </p>

                        <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-slate-800 flex items-center justify-center text-white font-serif font-bold border border-white/20">
                                {review.avatar}
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-white">{review.name}</h4>
                                <p className="text-xs text-slate-400 font-sans uppercase tracking-wide">{review.role}</p>
                            </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={12} /> Dự án: {review.project}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- SUB-COMPONENT: BLOG PREVIEW (Magazine Style) ---
const BlogPreviewSection = () => (
    <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
                <div>
                    <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block font-sans">
                        News & Inspiration
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">
                        Góc Cảm Hứng
                    </h2>
                </div>
                <Link href="/blog" className="hidden md:flex items-center gap-2 font-bold text-slate-900 hover:text-brand-600 transition-colors border-b-2 border-transparent hover:border-brand-600 pb-1 font-sans text-sm uppercase tracking-wide">
                    Xem tất cả bài viết <MoveRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {BLOG_POSTS.slice(0, 3).map((post, idx) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group cursor-pointer flex flex-col h-full">
                        <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3] shadow-sm">
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/95 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 rounded shadow-sm">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col flex-grow">
                            <div className="flex items-center gap-4 text-xs text-slate-400 uppercase tracking-wide font-sans mb-3">
                                <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-1"><User size={12}/> {post.author.name}</span>
                            </div>
                            
                            <h3 className="text-xl font-serif font-bold text-slate-900 leading-snug mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            
                            <p className="text-slate-500 font-sans text-sm leading-relaxed mb-6 line-clamp-2">
                                {post.excerpt}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest group-hover:text-brand-600 transition-colors flex items-center gap-2">
                                    Đọc Tiếp <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
       const prods = await getProducts();
       setProducts(prods);
       const cats = await getCategories();
       setCategories(cats);
    };
    loadData();
  }, []);

  const displayedProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.categories.includes(activeTab));

  return (
    <div className="animate-fade-in bg-white font-sans selection:bg-brand-900 selection:text-white">
      
      {/* 1. LUXURY SPLIT HERO */}
      <section className="relative min-h-[90vh] lg:h-screen flex flex-col lg:flex-row overflow-hidden">
         <div className="lg:w-[45%] h-[50vh] lg:h-full relative overflow-hidden group bg-slate-900">
             <img 
                src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000&auto=format&fit=crop" 
                alt="Luxury Interior" 
                className="w-full h-full object-cover opacity-80 transition-transform duration-[3s] group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90 lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900/50"></div>
             
             <div className="absolute top-8 left-8 z-10">
                 <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center animate-spin-slow hover:border-white transition-colors cursor-pointer">
                    <span className="font-serif font-bold text-2xl text-white">N</span>
                 </div>
             </div>
         </div>

         <div className="lg:w-[55%] h-auto lg:h-full bg-white flex flex-col justify-center px-6 md:px-16 lg:px-24 py-16 lg:py-0 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60 pointer-events-none"></div>

             <div className="max-w-xl relative z-10">
                 <div className="flex items-center gap-4 mb-8 animate-slide-up">
                     <span className="h-px w-16 bg-slate-900"></span>
                     <span className="text-slate-500 font-bold tracking-[0.2em] uppercase text-xs font-sans">Est. 2014</span>
                 </div>

                 <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.05] mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                     Đánh Thức <br/>
                     <span className="italic text-brand-600 relative inline-block">
                        Vẻ Đẹp Tường.
                     </span>
                 </h1>

                 <p className="text-lg text-slate-500 font-sans font-light leading-relaxed mb-12 animate-slide-up max-w-lg" style={{ animationDelay: '0.2s' }}>
                     Bộ sưu tập tấm ốp Nano, Lam sóng và PVC vân đá cao cấp. Sự kết hợp hoàn hảo giữa công nghệ vật liệu hiện đại và thẩm mỹ kiến trúc đương đại.
                 </p>

                 <div className="flex flex-wrap gap-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                     <Link href="/shop">
                        <Button className="h-14 px-10 bg-slate-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-brand-600 shadow-2xl shadow-slate-900/20 border-none rounded-sm transition-transform hover:-translate-y-1">
                            Xem Bộ Sưu Tập
                        </Button>
                     </Link>
                     <Link href="/projects" className="h-14 px-8 flex items-center gap-3 text-slate-900 font-bold uppercase text-xs tracking-widest border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all rounded-sm">
                         <PlayCircle size={20}/> Dự Án Thực Tế
                     </Link>
                 </div>
             </div>
         </div>
      </section>

      {/* 2. BRAND MARQUEE */}
      <BrandMarquee />

      {/* 3. CATEGORY MOSAIC */}
      <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block font-sans">Our Collections</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Danh Mục Sản Phẩm</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[350px]">
                  {categories.map((cat, index) => (
                      <Link 
                        key={cat.id} 
                        href={`/shop?cat=${cat.slug}`}
                        className={`group relative overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                      >
                          <img 
                            src={cat.headerImage || cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                          
                          <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                  {cat.count} Design Code
                              </p>
                              <h3 className={`font-serif font-bold text-white mb-4 leading-tight ${index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
                                  {cat.name}
                              </h3>
                              <div className="flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                                  Khám phá <div className="w-8 h-px bg-white"></div>
                              </div>
                          </div>
                      </Link>
                  ))}
                  
                  <Link href="/shop" className="relative bg-slate-900 flex items-center justify-center group overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="text-center relative z-10 transition-transform duration-500 group-hover:scale-110">
                          <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-slate-900 transition-all text-white">
                              <ArrowUpRight size={32} strokeWidth={1} />
                          </div>
                          <p className="text-white font-serif font-bold text-2xl">Xem Tất Cả</p>
                      </div>
                  </Link>
              </div>
          </div>
      </section>

      {/* 4. PRODUCT SHOWCASE */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-6">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">Sản Phẩm Tiêu Biểu</h2>
                      <p className="text-slate-500 font-sans font-light">Những mẫu bán chạy nhất được KTS khuyên dùng.</p>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar mt-6 md:mt-0 w-full md:w-auto">
                      <button 
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'}`}
                      >
                          Tất cả
                      </button>
                      {categories.slice(0, 3).map(cat => (
                           <button 
                            key={cat.id}
                            onClick={() => setActiveTab(cat.slug)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === cat.slug ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'}`}
                           >
                            {cat.name}
                           </button>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fade-in min-h-[400px]">
                  {displayedProducts.length > 0 ? (
                      displayedProducts.slice(0, 8).map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onQuickAdd={() => addToCart(product)}
                        />
                      ))
                  ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                          <Sparkles size={48} className="mb-4 opacity-20"/>
                          <p>Đang cập nhật bộ sưu tập mới.</p>
                      </div>
                  )}
              </div>
              
              <div className="mt-16 text-center">
                  <Link href="/shop">
                       <Button variant="outline" className="px-12 py-4 h-auto text-xs font-bold uppercase tracking-widest border border-slate-200 hover:border-slate-900 hover:bg-white text-slate-900 rounded-sm transition-all">
                           Vào Cửa Hàng
                       </Button>
                  </Link>
              </div>
          </div>
      </section>

      {/* 5. REVIEWS */}
      <ReviewSection />

      {/* 6. WHY CHOOSE US */}
      <section className="py-24 bg-slate-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
                  <div className="space-y-4 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-600 mb-4 mx-auto md:mx-0 shadow-sm border border-gray-100 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                          <CheckCircle2 size={32}/>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900">Chất lượng Nhật Bản</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-sans">Cốt nhựa nguyên sinh, an toàn tuyệt đối cho sức khỏe.</p>
                  </div>
                  <div className="space-y-4 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 mb-4 mx-auto md:mx-0 shadow-sm border border-gray-100 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                          <Box size={32}/>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900">Thi công siêu tốc</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-sans">Hệ thống hèm khóa thông minh giúp rút ngắn 50% thời gian.</p>
                  </div>
                  <div className="space-y-4 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 mb-4 mx-auto md:mx-0 shadow-sm border border-gray-100 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                          <Layers size={32}/>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900">Mẫu mã đa dạng</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-sans">Hơn 500+ mã màu vân gỗ, vân đá, vân vải cập nhật theo xu hướng.</p>
                  </div>
                  <div className="space-y-4 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 mb-4 mx-auto md:mx-0 shadow-sm border border-gray-100 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                          <ShieldCheck size={32}/>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900">Bảo hành 15 năm</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-sans">Cam kết độ bền màu và kết cấu. Bảo hành điện tử chính hãng.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* 7. BLOG */}
      <BlogPreviewSection />

      {/* 8. CTA BANNER */}
      <section className="relative py-32 bg-slate-900 overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
               <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-xs mb-6 block animate-pulse">
                   Ready to transform?
               </span>
               <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 tracking-tight leading-tight">
                   Nâng Tầm Không Gian Sống <br/> Của Bạn Ngay Hôm Nay.
               </h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                   <Link href="/contact">
                       <Button className="h-16 px-12 text-sm font-bold uppercase tracking-widest bg-amber-500 text-slate-900 hover:bg-white hover:text-slate-900 border-none shadow-[0_0_20px_rgba(245,158,11,0.3)] rounded-sm">
                           Liên Hệ Báo Giá
                       </Button>
                   </Link>
                   <Link href="/shop">
                       <Button variant="outline" className="h-16 px-12 text-sm font-bold uppercase tracking-widest bg-transparent border-slate-600 text-white hover:bg-white hover:text-slate-900 hover:border-white rounded-sm">
                           Xem Catalog
                       </Button>
                   </Link>
               </div>
          </div>
      </section>

    </div>
  );
}