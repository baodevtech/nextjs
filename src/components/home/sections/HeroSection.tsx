'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ChevronLeft, ShoppingBag, Info, X, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { LuxuryHotspotV2 } from './LuxuryHotspotV2';
import { HeroSlide } from '@/types';

// --- Dữ liệu mẫu (Giữ nguyên) ---
const DEFAULT_SLIDES: HeroSlide[] = [
    {
        id: 1,
        subtitle: "Bộ Sưu Tập 2024",
        title: "Vân Gỗ \nThượng Hạng",
        description: "Tái hiện vẻ đẹp nguyên bản của gỗ sồi Nga và óc chó Mỹ trong không gian sống hiện đại. Sự kết hợp hoàn hảo giữa kỹ thuật thủ công và công nghệ tiên tiến.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000",
        ctaLink: "/shop",
        ctaText: "Mua Ngay",
        hotspots: [] 
    },
    {
        id: 2,
        subtitle: "Không Gian Sống",
        title: "Tinh Tế \nĐẳng Cấp",
        description: "Sự kết hợp hoàn hảo giữa ánh sáng tự nhiên và chất liệu cao cấp tạo nên sự sang trọng. Mỗi chi tiết đều được chăm chút tỉ mỉ để mang lại trải nghiệm sống động.",
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
    const dataToRender = slides.length > 0 ? slides : DEFAULT_SLIDES;

    // --- STATE ---
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // State Mobile (Từ Code 2)
    const [showInfo, setShowInfo] = useState(false); 
    const [activeHotspotIndex, setActiveHotspotIndex] = useState<number | null>(null);

    // Swipe Logic
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    // Refs
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const parallaxRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);

    // --- ACTIONS ---
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

    // --- EFFECTS ---
    // 1. Parallax (Desktop)
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

    // 2. Auto Slide & Reset Mobile State
    useEffect(() => {
        setActiveHotspotIndex(null); 
        setShowInfo(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            nextSlide();
        }, 7000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentSlide, nextSlide]);

    // --- SWIPE HANDLERS ---
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
        if (distance > minSwipeDistance) nextSlide();
        else if (distance < -minSwipeDistance) prevSlide();
    };

    const nextSlideIndex = (currentSlide + 1) % dataToRender.length;

    return (
        <section 
            className="relative w-full overflow-hidden bg-slate-50 group/hero
            /* Mobile: Auto height + padding (giống Code 2) */
            h-auto pb-2 md:pb-0
            /* Desktop: Full height */
            md:h-[calc(100vh-102px)] md:min-h-[600px] 2xl:min-h-[750px] md:p-0"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            
            {/* ==============================================
                MOBILE LAYOUT: CODE 2 INTEGRATION
                (Aspect Video Card, Dark Theme, Icons)
               ============================================== */}
         {/* ==============================================
                MOBILE LAYOUT: SUPER COMPACT (Siêu nhỏ)
               ============================================== */}
            <div className="md:hidden w-full px-3 pt-3 pb-0">
                
                {/* Container: Aspect Video */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md shadow-amber-900/5 ring-1 ring-slate-900/5 bg-slate-900">
                    
                    {/* 1. Image Layer */}
                    {dataToRender.map((slide, idx) => (
                        <div 
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <Image 
                                src={slide.image} 
                                alt={slide.title} 
                                fill
                                className="object-cover object-center" 
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority={idx === 0}
                            />
                            
                            {/* Gradient: Clean, Bottom-focused */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-95"></div>

                            {/* Mobile Hotspots */}
                            <div className={`absolute inset-0 z-20 transition-opacity duration-300 ${showInfo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                               {currentSlide === idx && slide.hotspots?.map((hotspot, hIdx) => (
                                    <LuxuryHotspotV2
                                        key={hIdx}
                                        data={hotspot}
                                        isVisible={true}
                                        delayIndex={hIdx}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* 2. LEFT COMPACT BADGE (Vertical Pill) - THU NHỎ */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-16 z-30 flex flex-col items-center justify-between py-1.5 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full shadow-sm">
                        <span className="text-[7px] font-bold text-white font-mono leading-none">
                            0{currentSlide + 1}
                        </span>
                        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent my-1"></div>
                        <span className="text-[7px] font-bold text-white/40 font-mono leading-none">
                            0{dataToRender.length}
                        </span>
                    </div>

                    {/* 3. TOP RIGHT: Video Button - THU NHỎ */}
                    <div className="absolute top-2.5 right-2.5 z-30">
                        <Link href="/projects">
                            <button className="w-7 h-7 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:bg-white hover:text-black transition-all active:scale-95 shadow-sm">
                                <PlayCircle size={12} strokeWidth={1.5} />
                            </button>
                        </Link>
                    </div>

                    {/* 4. BOTTOM AREA: Text & Actions */}
                    <div className="absolute bottom-0 left-0 right-0 pl-8 pr-2.5 pb-2.5 z-30 flex items-end justify-between gap-2">
                        
                        {/* Text Content */}
                        <div className="flex-1 min-w-0 pb-0.5">
                            {dataToRender.map((slide, idx) => (
                                currentSlide === idx && (
                                    <div key={idx} className="flex flex-col animate-slide-in-right relative">
                                        
                                        {/* Description Panel (Expandable) */}
                                        <div 
                                            className={`
                                                overflow-hidden transition-all duration-300 ease-out origin-bottom
                                                ${showInfo ? 'max-h-24 opacity-100 mb-1.5' : 'max-h-0 opacity-0 mb-0'}
                                            `}
                                        >
                                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-2 text-slate-100">
                                                <p className="text-[9px] leading-relaxed font-medium line-clamp-3">
                                                    {slide.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Subtitle - THU NHỎ */}
                                        <span className="text-amber-400 text-[7px] font-bold uppercase tracking-widest mb-0.5 opacity-90">
                                            {slide.subtitle}
                                        </span>
                                        
                                        {/* Title Row - THU NHỎ FONT */}
                                        <div className="flex items-center gap-1.5">
                                            <h1 className="text-sm  font-bold text-white leading-none drop-shadow-sm truncate">
                                                {slide.title.replace('\n', ' ')}
                                            </h1>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
                                                className={`shrink-0 w-4 h-4 rounded-full border border-white/30 flex items-center justify-center transition-all ${showInfo ? 'bg-white text-black border-white' : 'bg-transparent text-white/80 hover:bg-white/20'}`}
                                            >
                                                {showInfo ? <X size={8} /> : <Info size={8} />}
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Action Stack (Bottom Right Corner) - THU NHỎ BUTTONS */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            
                            {/* Primary Action: Shop */}
                            <Link href={dataToRender[currentSlide].ctaLink || '/shop'}>
                                <button className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform relative group">
                                    <ShoppingBag size={12} strokeWidth={2} />
                                </button>
                            </Link>

                            {/* Navigation: Next (Progress Ring) */}
                            <div className="relative w-8 h-8 cursor-pointer active:scale-95 transition-transform" onClick={nextSlide}>
                                {/* SVG Progress Ring */}
                                <svg className="w-full h-full -rotate-90 transform">
                                    <circle 
                                        cx="16" cy="16" r="14" 
                                        stroke="currentColor" strokeWidth="1.5" fill="none" 
                                        className="text-white/10" 
                                    />
                                    <circle 
                                        key={currentSlide}
                                        cx="16" cy="16" r="14" 
                                        stroke="currentColor" strokeWidth="1.5" fill="none" 
                                        className="text-amber-500 transition-all duration-[7000ms] ease-linear" 
                                        strokeDasharray="88" // 2 * pi * r (approx for r=14)
                                        strokeDashoffset="0"
                                        style={{ strokeDashoffset: '0', animation: 'dash 7s linear forwards' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <ChevronRight size={14} strokeWidth={2} className="ml-0.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==============================================
                DESKTOP LAYOUT (Giữ nguyên của Code 1)
               ============================================== */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
                {/* Parallax Background */}
                <div ref={parallaxRef} className="absolute -top-[10%] left-0 w-full h-[120%] pointer-events-none z-0 will-change-transform">
                    {dataToRender.map((slide, idx) => (
                        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                            <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${currentSlide === idx ? 'scale-110' : 'scale-100'}`}>
                                <Image
                                    src={slide.image} alt={slide.title} fill sizes="100vw"
                                    priority={idx === 0}
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
                            {currentSlide === idx && slide.hotspots?.map((hotspot, hIdx) => (
                                <LuxuryHotspotV2 key={hIdx} data={hotspot} isVisible={true} delayIndex={hIdx} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex items-center px-10 2xl:px-20 pointer-events-none">
                    <div className="w-full pointer-events-auto max-w-2xl 2xl:max-w-4xl">
                        {dataToRender.map((slide, idx) => (
                            <div key={slide.id} className={`transition-all duration-1000 absolute top-1/2 -translate-y-1/2 left-10 2xl:left-20 pr-4 ${currentSlide === idx ? 'opacity-100 translate-y-[-50%] blur-0' : 'opacity-0 translate-y-[-45%] blur-sm pointer-events-none'}`}>
                                <div className="flex items-center gap-3 mb-4 2xl:mb-6">
                                    <span className="w-12 h-[2px] bg-amber-400 inline-block"></span>
                                    <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-xs 2xl:text-sm animate-slide-in-right">{slide.subtitle}</span>
                                </div>
                                <h1 className="text-6xl 2xl:text-8xl  font-bold text-white mb-6 2xl:mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">{slide.title}</h1>
                                <p className="text-slate-200 text-sm 2xl:text-lg font-light max-w-[450px] 2xl:max-w-lg mb-8 2xl:mb-12 leading-loose border-l border-white/20 pl-6">{slide.description}</p>
                                <div className="flex flex-row items-center gap-5 2xl:gap-6">
                                    <Link href={slide.ctaLink || '/shop'}>
                                        <Button className="h-12 px-8 text-xs 2xl:h-14 2xl:px-10 2xl:text-sm font-bold uppercase tracking-widest !bg-amber-400 !text-slate-900 hover:!bg-white border-none transition-all shadow-xl rounded-none">{slide.ctaText || 'Xem Chi Tiết'}</Button>
                                    </Link>
                                    <Link href="/projects" className="group flex items-center gap-3 text-white font-bold text-xs 2xl:text-sm uppercase tracking-widest hover:text-amber-400 transition-colors">
                                        Video Dự Án <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute bottom-0 left-0 right-0 z-30 px-10 2xl:px-20 py-6 2xl:py-10 flex items-end justify-between pointer-events-none">
                    <div className="flex items-center gap-6 2xl:gap-8 pointer-events-auto">
                        <div className="text-white font-mono text-xs 2xl:text-sm">
                            <span className="text-xl 2xl:text-2xl font-bold">0{currentSlide + 1}</span>
                            <span className="text-white/40 mx-2">/</span>
                            <span className="text-white/40">0{dataToRender.length}</span>
                        </div>
                        <div className="flex gap-2 2xl:gap-3">
                            {dataToRender.map((_, idx) => (
                                <button key={idx} onClick={() => goToSlide(idx)} className={`h-[2px] transition-all duration-500 ${currentSlide === idx ? 'w-10 2xl:w-16 bg-amber-400' : 'w-4 2xl:w-6 bg-white/20 hover:bg-white/50'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 2xl:gap-6 pointer-events-auto">
                        <button onClick={prevSlide} className="w-12 h-12 2xl:w-14 2xl:h-14 border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <div onClick={nextSlide} className="group relative w-32 h-20 2xl:w-48 2xl:h-32 cursor-pointer overflow-hidden shadow-lg border border-white/20 hover:border-amber-400 transition-colors">
                            {dataToRender[nextSlideIndex] && <Image src={dataToRender[nextSlideIndex].image} alt="Next" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors z-10"></div>
                            <div className="absolute bottom-0 left-0 h-[2px] bg-amber-400 animate-[progress_7s_linear_forwards] w-full origin-left z-30"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};