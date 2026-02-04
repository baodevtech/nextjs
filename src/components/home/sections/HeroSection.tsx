'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ChevronLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { LuxuryHotspotV2 } from './LuxuryHotspotV2';
import { HeroSlide } from '@/types';

// Dữ liệu dự phòng
const DEFAULT_SLIDES: HeroSlide[] = [
    {
        id: 1,
        subtitle: "Bộ Sưu Tập 2024",
        title: "Vân Gỗ \nThượng Hạng",
        description: "Tái hiện vẻ đẹp nguyên bản của gỗ sồi Nga và óc chó Mỹ trong không gian sống hiện đại.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000",
        ctaLink: "/shop",
        ctaText: "Mua Ngay",
        hotspots: [] 
    },
    {
        id: 2,
        subtitle: "Không Gian Sống",
        title: "Tinh Tế \nĐẳng Cấp",
        description: "Sự kết hợp hoàn hảo giữa ánh sáng tự nhiên và chất liệu cao cấp tạo nên sự sang trọng.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000",
        ctaLink: "/projects",
        ctaText: "Xem Dự Án",
        hotspots: []
    }
];

interface HeroSectionProps {
    slides?: HeroSlide[];
}

export const HeroSection = ({ slides = [] }: HeroSectionProps) => {
    // Logic Fallback
    const dataToRender = slides.length > 0 ? slides : DEFAULT_SLIDES;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hotspotsVisible, setHotspotsVisible] = useState(false);
    
    // State cho Mobile Swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    // Refs
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const parallaxRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);

    // --- HELPER FUNCTIONS ---
    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % dataToRender.length);
        setTimeout(() => setIsAnimating(false), 1000);
    }, [isAnimating, dataToRender.length]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + dataToRender.length) % dataToRender.length);
        setTimeout(() => setIsAnimating(false), 1000);
    }, [isAnimating, dataToRender.length]);

    const goToSlide = (idx: number) => {
        if (isAnimating || idx === currentSlide) return;
        setIsAnimating(true);
        setCurrentSlide(idx);
        setTimeout(() => setIsAnimating(false), 1000);
    };

    // --- 1. LOGIC PARALLAX (Desktop Only) ---
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const handleScroll = () => {
            if (requestRef.current) return;
            requestRef.current = requestAnimationFrame(() => {
                if (parallaxRef.current) {
                    const scrolled = window.scrollY;
                    if (scrolled < window.innerHeight * 1.5) {
                        parallaxRef.current.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
                    }
                }
                requestRef.current = null;
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // --- 2. LOGIC AUTO SLIDE & HOTSPOTS ---
    useEffect(() => {
        setHotspotsVisible(false);
        const hotspotTimer = setTimeout(() => {
            setHotspotsVisible(true);
        }, 1500);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            nextSlide();
        }, 7000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            clearTimeout(hotspotTimer);
        };
    }, [currentSlide, nextSlide]);

    // --- 3. SWIPE HANDLERS (Mobile) ---
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) nextSlide();
        else if (isRightSwipe) prevSlide();
    };

    const nextSlideIndex = (currentSlide + 1) % dataToRender.length;

    return (
        <section 
            className="relative w-full overflow-hidden bg-slate-900 group/hero 
            /* Mobile: Height dùng dvh để fix lỗi thanh địa chỉ browser + padding */
            h-[calc(100dvh-60px)] p-4
            /* Desktop: Height full viewport trừ header, reset padding */
            md:h-[calc(100vh-102px)] md:min-h-[600px] 2xl:min-h-[750px] md:p-0"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >

            {/* ==============================================
                MOBILE LAYOUT: WHITE CARD STYLE (Từ Code 2)
                Chỉ hiện ở md:hidden
               ============================================== */}
            <div className="md:hidden w-full h-full flex flex-col justify-center">
                {/* Card Container - White Background */}
                <div className="relative w-full h-full max-h-[620px] bg-white rounded-[24px] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-white/10 flex flex-col">
                    
                    {/* 1. Image Area (Top ~55%) */}
                    <div className="relative h-[55%] w-full overflow-hidden bg-slate-100">
                        {dataToRender.map((slide, idx) => (
                            <div 
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-700 ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <Image
                                    src={slide.image} 
                                    alt={slide.title} 
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                {/* Gradient dưới chân ảnh để blend vào phần trắng */}
                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white via-transparent to-transparent"></div>

                                {/* Hotspots Mobile (Optional) */}
                                {currentSlide === idx && slide.hotspots?.map((hotspot, hIdx) => (
                                    <LuxuryHotspotV2 key={hIdx} data={hotspot} isVisible={hotspotsVisible} delayIndex={hIdx} />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* 2. Content Area (Bottom ~45%) - White & Clean */}
                    <div className="flex-1 relative p-6 flex flex-col bg-white">
                        
                        {/* Top Row: Subtitle + Pagination */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="overflow-hidden">
                                {dataToRender.map((slide, idx) => (
                                    currentSlide === idx && (
                                        <div key={idx} className="animate-slide-in-right flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                            <span className="text-amber-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                                                {slide.subtitle}
                                            </span>
                                        </div>
                                    )
                                ))}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 font-medium tracking-widest border border-slate-200 px-2 py-1 rounded-full">
                                {currentSlide + 1 < 10 ? `0${currentSlide + 1}` : currentSlide + 1} / {dataToRender.length < 10 ? `0${dataToRender.length}` : dataToRender.length}
                            </div>
                        </div>

                        {/* Main Content Slider */}
                        <div className="relative flex-1">
                            {dataToRender.map((slide, idx) => (
                                <div 
                                    key={slide.id}
                                    className={`transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-center
                                    ${currentSlide === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
                                >
                                    {/* Title - Dark Text for White bg */}
                                    <div className="pl-4 border-l-2 border-amber-500 mb-3">
                                        <h1 className="text-2xl font-serif font-bold text-slate-900 leading-[1.1]">
                                            {slide.title}
                                        </h1>
                                    </div>

                                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6 pr-4 font-medium">
                                        {slide.description}
                                    </p>

                                    {/* Buttons Mobile */}
                                    <div className="flex items-center gap-3 w-full mt-auto">
                                        <Link href={slide.ctaLink || '/shop'} className="flex-[3]">
                                            <Button className="w-full h-11 text-[11px] font-bold uppercase tracking-widest !bg-amber-400 !text-slate-900 hover:!bg-amber-500 hover:!text-white transition-all shadow-lg shadow-amber-200/50 rounded-lg group border-none">
                                                Chi tiết <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                        <Link href="/projects" className="flex-[2]">
                                            <Button className="w-full h-11 text-[10px] font-bold uppercase tracking-widest bg-transparent border border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600 transition-colors rounded-lg flex items-center justify-center">
                                                Dự án
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar Bottom Mobile */}
                        <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-amber-500 transition-all duration-500 ease-out"
                                style={{ width: `${((currentSlide + 1) / dataToRender.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==============================================
                DESKTOP LAYOUT: FULL SCREEN PARALLAX (Từ Code 1)
                Chỉ hiện ở hidden md:block
               ============================================== */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
                
                {/* --- BACKGROUND PARALLAX --- */}
                <div ref={parallaxRef} className="absolute -top-[10%] left-0 w-full h-[120%] pointer-events-none z-0 will-change-transform">
                    {dataToRender.map((slide, idx) => (
                        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                            <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${currentSlide === idx ? 'scale-110' : 'scale-100'}`}>
                                <Image
                                    src={slide.image} alt={slide.title} fill sizes="100vw"
                                    priority={idx === 0}
                                    quality={90}
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
                            
                            {/* Hotspots Desktop */}
                            {currentSlide === idx && slide.hotspots?.map((hotspot, hIdx) => (
                                <LuxuryHotspotV2 key={hIdx} data={hotspot} isVisible={hotspotsVisible} delayIndex={hIdx} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* --- CONTENT OVERLAY DESKTOP --- */}
                <div className="absolute inset-0 z-20 flex items-center px-10 2xl:px-20 pointer-events-none">
                    <div className="w-full pointer-events-auto pb-10 2xl:pb-0 max-w-2xl 2xl:max-w-4xl">
                        {dataToRender.map((slide, idx) => (
                            <div key={slide.id} className={`transition-all duration-1000 absolute top-1/2 -translate-y-1/2 left-10 2xl:left-20 pr-4 ${currentSlide === idx ? 'opacity-100 translate-y-[-55%] 2xl:translate-y-[-50%] blur-0' : 'opacity-0 translate-y-[-45%] blur-sm pointer-events-none'}`}>
                                
                                <div className="flex items-center gap-3 mb-3 2xl:mb-6 overflow-hidden">
                                    <span className="w-8 2xl:w-12 h-[2px] bg-amber-400 inline-block"></span>
                                    <span className="text-amber-400 font-bold tracking-[0.2em] uppercase text-xs 2xl:text-sm animate-slide-in-right">
                                        {slide.subtitle}
                                    </span>
                                </div>

                                <h1 className="text-5xl 2xl:text-8xl font-serif font-bold text-white mb-5 2xl:mb-8 leading-[1.15] tracking-tight drop-shadow-2xl">
                                    {slide.title}
                                </h1>

                                <p className="text-slate-200 text-[13px] 2xl:text-lg font-light max-w-[400px] 2xl:max-w-lg mb-6 2xl:mb-10 leading-relaxed opacity-90 border-l border-white/20 pl-5 2xl:pl-6">
                                    {slide.description}
                                </p>

                                <div className="flex flex-row items-center gap-5 2xl:gap-6">
                                    <Link href={slide.ctaLink || '/shop'}>
                                        <Button className="h-10 px-6 text-xs 2xl:h-14 2xl:px-10 2xl:text-sm font-bold uppercase tracking-widest !bg-amber-400 !text-slate-900 hover:!bg-white hover:!text-slate-900 border-none transition-all shadow-lg whitespace-nowrap">
                                            {slide.ctaText || "Mua Ngay"}
                                        </Button>
                                    </Link>
                                    <Link href="/projects" className="group flex items-center gap-3 text-white font-bold text-xs 2xl:text-sm uppercase tracking-widest hover:text-amber-400 transition-colors">
                                        <span className="w-9 h-9 2xl:w-12 2xl:h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-amber-400 group-hover:scale-110 transition-all bg-white/5 backdrop-blur-sm">
                                            <PlayCircle size={14} className="2xl:w-5 2xl:h-5 ml-0.5" />
                                        </span>
                                        Dự Án
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- NAVIGATION CONTROLS DESKTOP --- */}
                <div className="absolute bottom-0 left-0 right-0 z-30 px-10 2xl:px-20 py-6 2xl:py-10 flex items-end justify-between pointer-events-none">
                    <div className="flex items-center gap-6 2xl:gap-8 pointer-events-auto">
                        <div className="text-white font-mono text-xs 2xl:text-sm">
                            <span className="text-xl 2xl:text-2xl font-bold">0{currentSlide + 1}</span>
                            <span className="text-white/40 mx-2">/</span>
                            <span className="text-white/40">0{dataToRender.length}</span>
                        </div>
                        <div className="flex gap-2 2xl:gap-3">
                            {dataToRender.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-10 2xl:w-16 bg-amber-400' : 'w-3 2xl:w-4 bg-white/20 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 2xl:gap-6 pointer-events-auto">
                        <button onClick={prevSlide} className="w-10 h-10 2xl:w-14 2xl:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                            <ChevronLeft size={20} className="2xl:w-6 2xl:h-6" />
                        </button>

                        <div onClick={nextSlide} className="group relative w-32 h-20 2xl:w-48 2xl:h-32 rounded-lg 2xl:rounded-xl overflow-hidden cursor-pointer border border-white/20 hover:border-amber-400 transition-colors shadow-2xl">
                            {dataToRender[nextSlideIndex] && (
                                <>
                                    <div className="absolute inset-0 w-full h-full">
                                        <Image src={dataToRender[nextSlideIndex].image} alt="Next" fill sizes="200px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors z-10"></div>
                                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20">
                                        <span className="text-[8px] 2xl:text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">Tiếp theo</span>
                                        <span className="font-serif font-bold text-xs 2xl:text-lg text-center px-2 line-clamp-1">
                                            {dataToRender[nextSlideIndex].title?.split('\n')[0]}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div key={currentSlide} className="absolute bottom-0 left-0 h-1 bg-amber-400 animate-[progress_7s_linear_forwards] w-full origin-left z-30"></div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};