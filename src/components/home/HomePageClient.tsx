
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, Star, Check, MoveRight, 
    Layers, Box, ShieldCheck, PlayCircle, Zap, ArrowUpRight, 
    Maximize2, MousePointer2, Plus, ChevronLeft, ChevronRight, Minus, ShoppingBag,
    Gem, Spline, Circle, Sparkles, Flame, Trophy, TrendingUp, Droplets, Leaf
} from 'lucide-react';
import { getProducts, getCategories } from '@/services/wpService';
import { Product, Category } from '@/types';
import { BLOG_POSTS } from '@/constants';
import { ProductCard } from '@/components/product/ProductComponents';
import { Button } from '@/components/common/UI';
import { useCart } from '@/context/CartContext';
import { LuxuryHotspotV2 } from './LuxuryHotspotV2';
import { CategoryShowcase } from './CategoryShowcase';


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

// --- COMPONENTS ---
const ShopTheLookPin: React.FC<{ x: string, y: string, label: string, onClick?: () => void, isActive?: boolean }> = ({ x, y, label, onClick, isActive }) => (
    <div 
        className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-pointer group/pin z-20"
        style={{ left: x, top: y }}
        onClick={onClick}
    >
        <div className={`absolute inset-0 rounded-full animate-ping ${isActive ? 'bg-brand-500/40' : 'bg-white/40'}`}></div>
        <div className={`relative w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] border-2 ring-1 transition-all duration-300 ${isActive ? 'bg-brand-500 border-white ring-brand-200 scale-125' : 'bg-white border-white ring-black/10'}`}></div>
        
        <div className={`absolute left-1/2 bottom-full mb-3 -translate-x-1/2 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:translate-y-0'}`}>
            <div className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded-lg shadow-xl whitespace-nowrap border border-white/50">
                {label}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90 mx-auto"></div>
        </div>
    </div>
);


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'premium'>('bestseller');
  const [activeShopLook, setActiveShopLook] = useState(0);
  const { addToCart } = useCart();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
       const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
       setProducts(prods);
       setCategories(cats);
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
        if (parallaxRef.current) {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight * 1.5) {
                parallaxRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setHotspotsVisible(false);
    const hotspotTimer = setTimeout(() => {
        setHotspotsVisible(true);
    }, 1500); 

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

  const displayedProducts = React.useMemo(() => {
      let filtered = [];
      if (activeTab === 'new') filtered = [...products].reverse();
      else if (activeTab === 'premium') filtered = products.filter(p => p.price.amount > 200000);
      else filtered = products; 
      
      return filtered;
  }, [products, activeTab]);

  return (
    <div className="animate-fade-in bg-white font-sans selection:bg-brand-900 selection:text-white">
      
      {/* 1. CINEMATIC LUXURY HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-slate-900 group/hero">
         <div ref={parallaxRef} className="absolute -top-[10%] left-0 w-full h-[120%] pointer-events-none z-0">
             {HERO_SLIDES.map((slide, idx) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${currentSlide === idx ? 'scale-110' : 'scale-100'}`}>
                        <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-cover"
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
         </div>

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
                             <Link href={slide.ctaLink}>
                                 <Button className="h-14 px-10 text-sm font-bold uppercase tracking-widest bg-white text-slate-900 hover:bg-amber-400 hover:text-slate-900 border-none transition-all duration-300">
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
                 <button 
                    onClick={prevSlide}
                    className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"
                 >
                     <ChevronLeft size={24}/>
                 </button>
                 <div 
                    onClick={nextSlide}
                    className="group relative w-48 h-32 rounded-xl overflow-hidden cursor-pointer border border-white/20 hover:border-amber-400 transition-colors"
                 >
                     <img 
                        src={HERO_SLIDES[nextSlideIndex].image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt="Next"
                     />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                     <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                         <span className="text-[10px] uppercase tracking-widest font-bold mb-1">Tiếp theo</span>
                         <span className="font-serif font-bold text-lg text-center px-2">{HERO_SLIDES[nextSlideIndex].title.split('\n')[0]}</span>
                     </div>
                     <div key={currentSlide} className="absolute bottom-0 left-0 h-1 bg-amber-400 animate-[progress_7s_linear_forwards] w-full origin-left"></div>
                 </div>
             </div>
         </div>
      </section>

      {/* 2. COMPACT CATEGORY STRIP */}
        <CategoryShowcase categories={categories} />
                     

      {/* 3. SIGNATURE COLLECTION (Apple-Style Grid) */}
      <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                  <div className="max-w-2xl">
                      <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6">
                          Sự Tinh Tế. <span className="text-slate-400">Trong Từng Chi Tiết.</span>
                      </h2>
                      <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                          Tuyển tập những mẫu tấm ốp Nano và Lam sóng mới nhất, được chế tác tỉ mỉ để tái định nghĩa không gian sống của bạn.
                      </p>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
                      {[
                          { id: 'bestseller', label: 'Bán Chạy' },
                          { id: 'new', label: 'Mới Nhất' },
                          { id: 'premium', label: 'Cao Cấp' }
                      ].map(tab => (
                          <button 
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as any)}
                              className={`
                                  px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                                  ${activeTab === tab.id 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-900'}
                              `}
                          >
                              {tab.label}
                          </button>
                      ))}
                  </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {displayedProducts.map((product) => (
                      <div key={product.id} className="animate-fade-in">
                          <ProductCard product={product} onQuickAdd={() => addToCart(product)} />
                      </div>
                  ))}
              </div>
              <div className="mt-20 text-center">
                  <Link href="/shop" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-lg hover:underline decoration-2 underline-offset-4 group">
                      Xem toàn bộ bộ sưu tập <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
          </div>
      </section>

      {/* 4. SHOP THE LOOK - IMMERSIVE SPLIT */}
      <section className="py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">Cảm Hứng Không Gian</h2>
                  <p className="text-slate-500 text-lg">Khám phá các phong cách nội thất xu hướng 2024</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px] lg:h-[600px]">
                  {/* Interactive Image - 8 Cols */}
                  <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl group select-none">
                      <img 
                        src="https://images.unsplash.com/photo-1595515106967-14348984f548?q=80&w=2000&auto=format&fit=crop" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        alt="Living Room" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                      
                      <ShopTheLookPin 
                        x="30%" y="40%" label="Vách Tivi Nano" 
                        isActive={activeShopLook === 0} 
                        onClick={() => setActiveShopLook(0)} 
                      />
                      <ShopTheLookPin 
                        x="60%" y="25%" label="Trần Lam Sóng" 
                        isActive={activeShopLook === 1} 
                        onClick={() => setActiveShopLook(1)} 
                      />
                      <ShopTheLookPin 
                        x="80%" y="60%" label="Phào Chỉ PS" 
                        isActive={activeShopLook === 2} 
                        onClick={() => setActiveShopLook(2)} 
                      />
                  </div>

                  {/* Manifest List - 4 Cols */}
                  <div className="lg:col-span-4 flex flex-col h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Danh Sách Vật Tư</h3>
                      
                      <div className="flex-1 space-y-4 relative z-10 overflow-y-auto no-scrollbar">
                          {[
                              { id: 0, name: 'Tấm Ốp Nano Vân Gỗ', sku: 'N-012', price: '145.000₫/m2', img: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?q=80&w=200&auto=format&fit=crop' },
                              { id: 1, name: 'Lam Sóng Trắng Sứ', sku: 'L-305', price: '180.000₫/m2', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=200&auto=format&fit=crop' },
                              { id: 2, name: 'Phào Chỉ PS Hàn Quốc', sku: 'P-99', price: '85.000₫/m', img: 'https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=200&auto=format&fit=crop' }
                          ].map((item, idx) => (
                              <div 
                                key={idx}
                                onClick={() => setActiveShopLook(idx)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${activeShopLook === idx ? 'border-brand-500 bg-brand-50 shadow-md transform scale-[1.02]' : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'}`}
                              >
                                  <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                      <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className={`font-bold text-sm truncate ${activeShopLook === idx ? 'text-brand-700' : 'text-slate-900'}`}>{item.name}</h4>
                                      <p className="text-xs text-slate-500 mt-0.5">{item.sku}</p>
                                      <p className="text-sm font-semibold text-slate-900 mt-1">{item.price}</p>
                                  </div>
                                  {activeShopLook === idx && <div className="w-2 h-2 rounded-full bg-brand-500"></div>}
                              </div>
                          ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
                          <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-slate-500 font-medium">Tổng ước tính</span>
                              <span className="text-xl font-bold text-slate-900">~8.500.000₫</span>
                          </div>
                          <Button fullWidth className="h-12 shadow-lg shadow-brand-500/20">
                              <span className="flex items-center gap-2">Nhận Báo Giá Trọn Gói <ArrowRight size={16}/></span>
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. QUALITY - BENTO GRID */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 max-w-3xl mx-auto">
                  <h2 className="text-4xl font-semibold text-slate-900 tracking-tight mb-4">Tiêu Chuẩn Đại Nam Wall</h2>
                  <p className="text-slate-500 text-lg">Chúng tôi không chỉ bán vật liệu, chúng tôi cung cấp sự an tâm tuyệt đối cho công trình của bạn.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
                  {/* Card 1: Main Feature (Large) */}
                  <div className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-200"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-brand-600">
                                  <Layers size={24} />
                              </div>
                              <h3 className="text-3xl font-bold text-slate-900 mb-4">Cấu Trúc 5 Lớp <br/> Siêu Bền</h3>
                              <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                                  Công nghệ ép nhiệt Nano tiên tiến giúp liên kết 5 lớp vật liệu thành một khối thống nhất. Chống tách lớp, cong vênh trong mọi điều kiện thời tiết.
                              </p>
                          </div>
                          <div className="mt-8 flex gap-3">
                              <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">UV Protection</span>
                              <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">Scratch Resistant</span>
                          </div>
                      </div>
                      <img src="https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop" className="absolute bottom-0 right-0 w-1/2 h-2/3 object-contain object-bottom translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-700" alt="Layers" />
                  </div>

                  {/* Card 2: Water Resistance */}
                  <div className="bg-slate-50 rounded-3xl p-8 relative overflow-hidden group hover:bg-blue-50 transition-colors duration-300">
                      <Droplets className="text-blue-500 mb-4 w-10 h-10" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Chống Nước 100%</h3>
                      <p className="text-slate-500 text-sm">Giải pháp hoàn hảo cho tường ẩm mốc. Không mối mọt.</p>
                  </div>

                  {/* Card 3: Eco Friendly */}
                  <div className="bg-slate-50 rounded-3xl p-8 relative overflow-hidden group hover:bg-green-50 transition-colors duration-300">
                      <Leaf className="text-green-500 mb-4 w-10 h-10" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">An Toàn Sức Khỏe</h3>
                      <p className="text-slate-500 text-sm">Nhựa nguyên sinh không chứa Formaldehyde. An toàn cho trẻ nhỏ.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. BLOG - EDITORIAL STYLE */}
      <section className="py-32 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-16">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">The Journal.</h2>
                  <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all pb-1">
                      Đọc tất cả bài viết <ArrowRight size={16} />
                  </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Featured Article (Left - 2 Cols) */}
                  <div className="lg:col-span-2 group cursor-pointer">
                      <div className="aspect-[16/9] overflow-hidden rounded-3xl mb-6 relative">
                          <img 
                            src={BLOG_POSTS[0].image} 
                            alt={BLOG_POSTS[0].title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          />
                          <div className="absolute top-6 left-6">
                              <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                                  Featured Story
                              </span>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                          <span className="text-brand-600">{BLOG_POSTS[0].category}</span>
                          <span>—</span>
                          <span>{BLOG_POSTS[0].date}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight group-hover:text-brand-600 transition-colors">
                          {BLOG_POSTS[0].title}
                      </h3>
                      <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                          {BLOG_POSTS[0].excerpt}
                      </p>
                  </div>

                  {/* Side List (Right - 1 Col) */}
                  <div className="flex flex-col gap-10">
                      {BLOG_POSTS.slice(1, 3).map((post) => (
                          <div key={post.id} className="group cursor-pointer">
                              <div className="aspect-[3/2] overflow-hidden rounded-2xl mb-4">
                                  <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                  />
                              </div>
                              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                  <span className="text-brand-600">{post.category}</span>
                                  <span>{post.readTime}</span>
                              </div>
                              <h4 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
                                  {post.title}
                              </h4>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* 7. CTA BANNER - MINIMALIST DARK */}
      <section className="py-32 bg-slate-950 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
          <div className="max-w-3xl mx-auto px-4 relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-none">
                  Ready to <br/> Transform?
              </h2>
              <p className="text-slate-400 text-xl mb-12 font-light max-w-xl mx-auto leading-relaxed">
                  Liên hệ ngay với chuyên gia của Đại Nam Wall để nhận tư vấn giải pháp tối ưu cho không gian của bạn.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/contact">
                      <button className="h-16 px-10 rounded-full bg-white text-slate-950 text-base font-bold uppercase tracking-widest hover:bg-brand-400 hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                          Nhận Báo Giá Ngay
                      </button>
                  </Link>
                  <a href="tel:0912345678" className="h-16 px-10 flex items-center justify-center rounded-full border border-slate-700 text-white text-base font-bold uppercase tracking-widest hover:bg-slate-800 hover:border-slate-600 transition-colors">
                      Hotline: 0912.345.678
                  </a>
              </div>
          </div>
      </section>

    </div>
  );
}
