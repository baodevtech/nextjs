'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // IMPORT QUAN TRỌNG
import { 
    ArrowRight, MoveRight, Layers, Box, PlayCircle, 
    ChevronLeft, ChevronRight, Gem, Spline, Maximize2, MousePointer2
} from 'lucide-react';
import { Product, Category } from '@/types';
import { BLOG_POSTS } from '@/constants';
import { ProductCard } from '@/components/product/ProductComponents';
import { Button } from '@/components/common/UI';
import { useCart } from '@/context/CartContext';
import { LuxuryHotspotV2 } from './LuxuryHotspotV2';

// --- HERO DATA ---
const HERO_SLIDES = [
  {
    id: 1,
    subtitle: "Bộ Sưu Tập 2024",
    title: "Vân Gỗ \nThượng Hạng",
    description: "Tái hiện vẻ đẹp nguyên bản của gỗ sồi Nga và óc chó Mỹ với công nghệ in Nano 3D 5 lớp. Chống nước tuyệt đối, bảo hành 20 năm.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
    ctaLink: "/shop?cat=nano",
    hotspots: [
        { x: "55%", y: "40%", name: "Nano Vân Óc Chó", price: "350.000₫/m2", position: "left" },
        { x: "68%", y: "75%", name: "Sàn SPC 8mm", price: "280.000₫/m2", position: "left" },
        { x: "88%", y: "35%", name: "Lam Sóng 3S", price: "185.000₫/thanh", position: "left" }
    ]
  },
  {
    id: 2,
    subtitle: "Kiến Trúc Đương Đại",
    title: "Đá Marble \nXuyên Sáng",
    description: "Giải pháp thay thế đá tự nhiên hoàn hảo cho không gian Luxury. Khổ lớn 1.2m x 2.4m, bề mặt tráng gương đẳng cấp.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    ctaLink: "/shop?cat=pvc-stone",
    hotspots: [
        { x: "60%", y: "45%", name: "PVC Marble Calacatta", price: "420.000₫/m2", position: "left" },
        { x: "80%", y: "65%", name: "Nẹp Inox Gold", price: "85.000₫/m", position: "left" }
    ]
  },
  {
    id: 3,
    subtitle: "Xu Hướng Mới",
    title: "Lam Sóng \nKhông Gian",
    description: "Tạo chiều sâu và điểm nhấn kiến trúc với hệ lam sóng Composite thế hệ mới. Chống cong vênh, thi công nhanh chóng.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    ctaLink: "/shop?cat=lam-song",
    hotspots: [
        { x: "55%", y: "50%", name: "Lam 4 Sóng Thấp", price: "180.000₫/thanh", position: "left" },
        { x: "75%", y: "25%", name: "Hệ Trần Nan Gỗ", price: "Liên hệ", position: "left" },
        { x: "85%", y: "60%", name: "Vách Phẳng Nano", price: "320.000₫/m2", position: "left" }
    ]
  }
];

// --- COMPONENTS CON ---
const ShopTheLookPin: React.FC<{ x: string, y: string, label: string }> = ({ x, y, label }) => (
    <div 
        className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-pointer group/pin z-20"
        style={{ left: x, top: y }}
    >
        <div className="absolute inset-0 bg-white/40 rounded-full animate-ping"></div>
        <div className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] border-2 border-white ring-1 ring-black/10"></div>
        <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 transition-all transform translate-y-2 group-hover/pin:translate-y-0 duration-300 pointer-events-none">
            <div className="bg-white text-slate-900 text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded shadow-xl whitespace-nowrap">
                {label}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white mx-auto"></div>
        </div>
    </div>
);

// --- MAIN CLIENT COMPONENT ---
interface HomePageClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
}

export default function HomePageClient({ initialProducts, initialCategories }: HomePageClientProps) {
  // Sử dụng props truyền vào làm initial state hoặc dùng trực tiếp
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
  const { addToCart } = useCart();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Không cần useEffect fetch data nữa vì đã có data từ props

  useEffect(() => {
    setHotspotsVisible(false);
    const hotspotTimer = setTimeout(() => {
        setHotspotsVisible(true);
    }, 2000);

    resetTimer();

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        clearTimeout(hotspotTimer);
    };
  }, [currentSlide]);

  const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
          nextSlide();
      }, 7000);
  };

  const nextSlide = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
      setTimeout(() => setIsAnimating(false), 1000);
  };

  const goToSlide = (idx: number) => {
      if (isAnimating || idx === currentSlide) return;
      setIsAnimating(true);
      setCurrentSlide(idx);
      setTimeout(() => setIsAnimating(false), 1000);
  }

  const bestSellers = products.slice(0, 6);
  const nextSlideIndex = (currentSlide + 1) % HERO_SLIDES.length;

  return (
    <div className="animate-fade-in bg-white font-sans selection:bg-brand-900 selection:text-white">
      
      {/* 1. CINEMATIC LUXURY HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-slate-900 group/hero">
         {HERO_SLIDES.map((slide, idx) => (
            <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                {/* THAY THẾ IMG BẰNG NEXT/IMAGE
                   - fill: Để ảnh tràn full container
                   - priority: Slide đầu tiên (idx === 0) load ngay lập tức để LCP tốt
                   - quality: 90 để ảnh sắc nét trên màn hình lớn
                */}
                <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${currentSlide === idx ? 'scale-110' : 'scale-100'}`}>
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        quality={90}
                        sizes="100vw"
                    />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                
                {currentSlide === idx && slide.hotspots?.map((hotspot, hIdx) => (
                    <LuxuryHotspotV2 
                        key={hIdx} 
                        data={hotspot} 
                        isVisible={hotspotsVisible} 
                        delayIndex={hIdx}
                    />
                ))}
            </div>
         ))}

         {/* Content Layer */}
         <div className="absolute inset-0 z-20 flex items-center px-6 sm:px-12 lg:px-20 pointer-events-none">
             <div className="max-w-4xl w-full pointer-events-auto">
                 {HERO_SLIDES.map((slide, idx) => (
                     <div 
                        key={slide.id} 
                        className={`transition-all duration-1000 absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 lg:left-20 ${currentSlide === idx ? 'opacity-100 translate-y-[-50%] blur-0' : 'opacity-0 translate-y-[-40%] blur-sm pointer-events-none'}`}
                     >
                         <div className="flex items-center gap-4 mb-6 overflow-hidden">
                             <span className="w-12 h-[2px] bg-amber-400 inline-block"></span>
                             <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-sm animate-slide-in-right">
                                 {slide.subtitle}
                             </span>
                         </div>
                         <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight whitespace-pre-line drop-shadow-2xl">
                             {slide.title}
                         </h1>
                         <p className="text-slate-200 text-lg font-light max-w-lg mb-10 leading-relaxed opacity-90 border-l border-white/20 pl-6">
                             {slide.description}
                         </p>
                         <div className="flex items-center gap-6">
                            <Link href="/shop">
                                <Button className="h-14 px-10 !bg-amber-500 !text-slate-900 font-bold uppercase tracking-widest hover:!bg-white hover:!text-amber-500 transition-all duration-300 border-none">
                                    Khám Phá Ngay
                                </Button>
                            </Link>
                             <Link href="/projects" className="group flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest hover:text-amber-400 transition-colors">
                                 <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-amber-400 group-hover:scale-110 transition-all">
                                     <PlayCircle size={20} className="ml-1" />
                                 </span>
                                 Xem Dự Án
                             </Link>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* Navigation & Preview */}
         <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-12 lg:px-20 py-10 flex items-end justify-between">
             <div className="flex items-center gap-8">
                 <div className="text-white font-mono text-sm">
                     <span className="text-2xl font-bold">0{currentSlide + 1}</span>
                     <span className="text-white/40 mx-2">/</span>
                     <span className="text-white/40">0{HERO_SLIDES.length}</span>
                 </div>
                 <div className="flex gap-3">
                     {HERO_SLIDES.map((_, idx) => (
                         <button 
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-16 bg-amber-400' : 'w-4 bg-white/20 hover:bg-white/50'}`}
                         />
                     ))}
                 </div>
             </div>

             <div className="hidden md:flex items-center gap-6">
                 <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                     <ChevronLeft size={24}/>
                 </button>
                 <div onClick={nextSlide} className="group relative w-48 h-32 rounded-xl overflow-hidden cursor-pointer border border-white/20 hover:border-amber-400 transition-colors">
                     {/* Preview Image next/image */}
                     <Image 
                        src={HERO_SLIDES[nextSlideIndex].image} 
                        alt="Next Slide"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 200px"
                     />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                     <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
                         <span className="text-[10px] uppercase tracking-widest font-bold mb-1">Tiếp theo</span>
                         <span className="font-serif font-bold text-lg text-center px-2">{HERO_SLIDES[nextSlideIndex].title.split('\n')[0]}</span>
                     </div>
                     <div key={currentSlide} className="absolute bottom-0 left-0 h-1 bg-amber-400 animate-[progress_7s_linear_forwards] w-full origin-left z-20"></div>
                 </div>
             </div>
         </div>
      </section>

      {/* 2. CATEGORY STRIP */}
      <section className="py-20 bg-white border-b border-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 font-serif">Danh Mục Sản Phẩm</h2>
                  {/* ... pagination dots ... */}
              </div>

              <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                  {categories.map((cat, idx) => (
                      <Link 
                        key={cat.id} 
                        href={`/shop?cat=${cat.slug}`}
                        className="group flex-shrink-0 w-72 snap-start relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
                      >
                          {/* Category Image */}
                          <Image 
                            src={cat.image} 
                            alt={cat.name} 
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                          
                          <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1 block">Collection 0{idx+1}</span>
                              <h3 className="text-2xl font-serif font-bold mb-2">{cat.name}</h3>
                              <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                  Xem {cat.count} mẫu <ArrowRight size={14} />
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* ... Header Text ... */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {bestSellers.map(product => (
                      <ProductCard key={product.id} product={product} onQuickAdd={() => addToCart(product)} />
                  ))}
              </div>
              {/* ... Button ... */}
          </div>
      </section>

      {/* 4. SHOP THE LOOK */}
      <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 order-2 lg:order-1">
                      {/* ... Text Content ... */}
                      <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer group bg-white">
                              <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                                  <Image src="https://picsum.photos/seed/woodpanel1/100/100" fill className="object-cover" alt="Product" sizes="64px" />
                              </div>
                              {/* ... Product Info ... */}
                          </div>

                          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer group bg-white">
                              <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                                  <Image src="https://picsum.photos/seed/whitepanel/100/100" fill className="object-cover" alt="Product" sizes="64px" />
                              </div>
                              {/* ... Product Info ... */}
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-7 relative order-1 lg:order-2">
                      <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3] group">
                          {/* Main Shop The Look Image */}
                          <Image 
                            src="https://images.unsplash.com/photo-1595515106967-14348984f548?q=80&w=2000&auto=format&fit=crop" 
                            alt="Shop the look"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          
                          <ShopTheLookPin x="30%" y="40%" label="Vách Tivi Nano" />
                          <ShopTheLookPin x="60%" y="25%" label="Trần Lam Sóng" />
                          <ShopTheLookPin x="80%" y="60%" label="Phào Chỉ PS" />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. QUALITY / WHY CHOOSE US */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         {/* Background Texture giữ nguyên vì là pattern nhỏ */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          {/* ... Content ... */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                  <div className="md:col-span-1">
                      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Chất Lượng <br/> Vượt Trội.</h2>
                      <p className="text-slate-400 leading-relaxed mb-8">
                          Sản phẩm Đại Nam Wall được sản xuất trên dây chuyền công nghệ Đức, đảm bảo độ bền màu 20 năm và an toàn tuyệt đối cho sức khỏe.
                      </p>
                      <Link href="/about" className="inline-flex items-center gap-2 text-brand-400 font-bold hover:text-white transition-colors">
                          Xem Hồ Sơ Năng Lực <MoveRight size={16} />
                      </Link>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                          <Layers className="text-brand-400 mb-4" size={32} />
                          <h4 className="font-bold text-lg mb-2">Cấu Trúc 5 Lớp</h4>
                          <p className="text-sm text-slate-400">Lớp phủ UV kép chống trầy xước, lớp film màu nhập khẩu và cốt nhựa nguyên sinh siêu bền.</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                          <Box className="text-brand-400 mb-4" size={32} />
                          <h4 className="font-bold text-lg mb-2">Chống Nước 100%</h4>
                          <p className="text-sm text-slate-400">Giải pháp hoàn hảo cho tường ẩm mốc. Không cong vênh, không mối mọt trong mọi điều kiện.</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                          <Maximize2 className="text-brand-400 mb-4" size={32} />
                          <h4 className="font-bold text-lg mb-2">Khổ Tấm Linh Hoạt</h4>
                          <p className="text-sm text-slate-400">Đa dạng kích thước từ 3m đến 6m, phù hợp mọi chiều cao trần, hạn chế mối nối.</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                          <MousePointer2 className="text-brand-400 mb-4" size={32} />
                          <h4 className="font-bold text-lg mb-2">Dễ Dàng Thi Công</h4>
                          <p className="text-sm text-slate-400">Hệ thống hèm khóa thông minh giúp tiết kiệm 50% thời gian lắp đặt so với vật liệu truyền thống.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. BLOG HIGHLIGHTS */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* ... Header ... */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {BLOG_POSTS.slice(0, 3).map(post => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="group cursor-pointer">
                          <div className="overflow-hidden rounded-xl aspect-video mb-4 relative">
                              <Image 
                                src={post.image} 
                                alt={post.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-slate-900 z-10">
                                  {post.category}
                              </div>
                          </div>
                          {/* ... Text ... */}
                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">
                              {post.title}
                          </h3>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                              <span>{post.date}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{post.readTime}</span>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* 7. CTA BANNER */}
      {/* ... Giữ nguyên phần Text CTA ... */}
      <section className="py-20 bg-brand-50 border-t border-brand-100">
          <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                  Sẵn sàng thay đổi không gian sống?
              </h2>
              <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
                  Liên hệ ngay với Đại Nam Wall để nhận catalog mẫu miễn phí và tư vấn giải pháp thi công tối ưu nhất cho ngôi nhà của bạn.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/contact">
                      <Button className="h-14 px-10 shadow-xl shadow-brand-500/20 text-base">
                          Nhận Báo Giá Ngay
                      </Button>
                  </Link>
                  <a href="tel:0912345678" className="h-14 px-10 flex items-center justify-center font-bold text-slate-700 bg-white rounded-lg border border-slate-200 hover:border-slate-900 hover:text-slate-900 transition-colors">
                      Hotline: 0912.345.678
                  </a>
              </div>
          </div>
      </section>

    </div>
  );
}