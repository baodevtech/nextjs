// src/components/home/sections/HeroSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PlayCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { LuxuryHotspotV2 } from './LuxuryHotspotV2';
import { HeroSlide } from '@/types'; // Import type

// Dữ liệu Fallback (Dùng khi ACF chưa có dữ liệu hoặc API lỗi)
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    subtitle: "Bộ Sưu Tập 2024",
    title: "Vân Gỗ \nThượng Hạng",
    description: "Tái hiện vẻ đẹp nguyên bản của gỗ sồi Nga và óc chó Mỹ.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000",
    ctaLink: "/shop",
    hotspots: []
  }
];

interface HeroSectionProps {
    slides?: HeroSlide[];
}

export const HeroSection = ({ slides = [] }: HeroSectionProps) => {
  // Nếu không có slides từ API, dùng Default để tránh lỗi giao diện
  const dataToRender = slides.length > 0 ? slides : DEFAULT_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // ... (Giữ nguyên logic useEffect handleScroll và Timer)
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
      setCurrentSlide((prev) => (prev + 1) % dataToRender.length);
      setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + dataToRender.length) % dataToRender.length);
      setTimeout(() => setIsAnimating(false), 1000);
  };

  const goToSlide = (idx: number) => {
      if (isAnimating || idx === currentSlide) return;
      setIsAnimating(true);
      setCurrentSlide(idx);
      setTimeout(() => setIsAnimating(false), 1000);
  }

  const nextSlideIndex = (currentSlide + 1) % dataToRender.length;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900 group/hero">
         <div ref={parallaxRef} className="absolute -top-[10%] left-0 w-full h-[120%] pointer-events-none z-0">
             {dataToRender.map((slide, idx) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${currentSlide === idx ? 'scale-110' : 'scale-100'}`}>
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover"/>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    {/* Render Hotspots từ dữ liệu động */}
                    {currentSlide === idx && slide.hotspots?.map((hotspot, hIdx) => (
                         <LuxuryHotspotV2 key={hIdx} data={hotspot} isVisible={hotspotsVisible} delayIndex={hIdx}/>
                    ))}
                </div>
             ))}
         </div>

         {/* Content Overlay */}
         <div className="absolute inset-0 z-20 flex items-center px-6 sm:px-12 lg:px-20 pointer-events-none">
             <div className="max-w-4xl w-full pointer-events-auto">
                 {dataToRender.map((slide, idx) => (
                     <div key={slide.id} className={`transition-all duration-1000 absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 lg:left-20 ${currentSlide === idx ? 'opacity-100 translate-y-[-50%] blur-0' : 'opacity-0 translate-y-[-40%] blur-sm pointer-events-none'}`}>
                         <div className="flex items-center gap-4 mb-6 overflow-hidden">
                             <span className="w-12 h-[2px] bg-amber-400 inline-block"></span>
                             <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-sm animate-slide-in-right">{slide.subtitle}</span>
                         </div>
                         <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight whitespace-pre-line drop-shadow-2xl">{slide.title}</h1>
                         <p className="text-slate-200 text-lg font-light max-w-lg mb-10 leading-relaxed opacity-90 border-l border-white/20 pl-6">{slide.description}</p>
                         <div className="flex items-center gap-6">
                             <Link href={slide.ctaLink}>
                                 <Button className="h-14 px-10 text-sm font-bold uppercase tracking-widest !bg-amber-400 !text-slate-900 hover:bg-amber-400 hover:text-slate-900 border-none transition-all duration-300">
                                    {slide.ctaText || "Khám Phá Ngay"}
                                 </Button>
                             </Link>
                             <Link href="/projects" className="group flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest hover:text-amber-400 transition-colors">
                                 <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-amber-400 group-hover:scale-110 transition-all"><PlayCircle size={20} className="ml-1" /></span>
                                 Xem Dự Án
                             </Link>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* Navigation Controls */}
         <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-12 lg:px-20 py-10 flex items-end justify-between">
             <div className="flex items-center gap-8">
                 <div className="text-white font-mono text-sm">
                     <span className="text-2xl font-bold">0{currentSlide + 1}</span>
                     <span className="text-white/40 mx-2">/</span>
                     <span className="text-white/40">0{dataToRender.length}</span>
                 </div>
                 <div className="flex gap-3">
                     {dataToRender.map((_, idx) => (
                         <button key={idx} onClick={() => goToSlide(idx)} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-16 bg-amber-400' : 'w-4 bg-white/20 hover:bg-white/50'}`}/>
                     ))}
                 </div>
             </div>
             <div className="hidden md:flex items-center gap-6">
                 <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"><ChevronLeft size={24}/></button>
                 
                 {/* Next Slide Preview */}
                 <div onClick={nextSlide} className="group relative w-48 h-32 rounded-xl overflow-hidden cursor-pointer border border-white/20 hover:border-amber-400 transition-colors">
                     {/* Kiểm tra nextSlide có tồn tại không trước khi render ảnh */}
                     {dataToRender[nextSlideIndex] && (
                        <>
                           <img src={dataToRender[nextSlideIndex].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Next"/>
                           <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                           <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                               <span className="text-[10px] uppercase tracking-widest font-bold mb-1">Tiếp theo</span>
                               <span className="font-serif font-bold text-lg text-center px-2 line-clamp-1">{dataToRender[nextSlideIndex].title.split('\n')[0]}</span>
                           </div>
                        </>
                     )}
                     <div key={currentSlide} className="absolute bottom-0 left-0 h-1 bg-amber-400 animate-[progress_7s_linear_forwards] w-full origin-left"></div>
                 </div>
             </div>
         </div>
      </section>
  );
};