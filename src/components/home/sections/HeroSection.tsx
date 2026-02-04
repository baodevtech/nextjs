// src/components/home/sections/HeroSection.tsx

'use client';



import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';

import Image from 'next/image';

import { PlayCircle, ChevronLeft } from 'lucide-react';

import { Button } from '@/components/common/UI';

import { LuxuryHotspotV2 } from './LuxuryHotspotV2';

// Đảm bảo bạn đã import đúng đường dẫn component LuxuryHotspotV2 chúng ta vừa sửa

import { HeroSlide } from '@/types';

// Đảm bảo type HeroSlide khớp với dữ liệu



// Dữ liệu dự phòng (Dùng khi chưa có API)

const DEFAULT_SLIDES: HeroSlide[] = [

    {

        id: 1,

        subtitle: "Bộ Sưu Tập 2024",

        title: "Vân Gỗ \nThượng Hạng",

        description: "Tái hiện vẻ đẹp nguyên bản của gỗ sồi Nga và óc chó Mỹ trong không gian sống hiện đại.",

        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000",

        ctaLink: "/shop",

        hotspots: [] // Hotspot rỗng cho fallback

    }

];

interface HeroSectionProps {

    slides?: HeroSlide[];

}



export const HeroSection = ({ slides = [] }: HeroSectionProps) => {

    // Logic Fallback

    const dataToRender = slides.length > 0 ? slides : []; // (Dùng default của bạn nếu cần)



    const [currentSlide, setCurrentSlide] = useState(0);

    const [isAnimating, setIsAnimating] = useState(false);

    const [hotspotsVisible, setHotspotsVisible] = useState(false);



    // Refs

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const parallaxRef = useRef<HTMLDivElement>(null);

    const requestRef = useRef<number | null>(null);



    // --- 1. LOGIC PARALLAX (Chỉ chạy trên Desktop/Tablet để mượt mà trên Mobile) ---

    useEffect(() => {

        // Detect mobile đơn giản để tắt parallax nếu cần tiết kiệm pin

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



        resetAutoSlideTimer();

        return () => {

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            clearTimeout(hotspotTimer);

        };

    }, [currentSlide]);



    const resetAutoSlideTimer = () => {

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

        // RESPONSIVE HEIGHT:

        // Mobile: h-[calc(100vh-60px)] (trừ header mobile thấp hơn) + min-h thấp hơn (480px)

        // Laptop (lg): min-h-[550px]

        // Desktop (2xl): min-h-[700px]

        <section className="relative w-full overflow-hidden bg-slate-900 group/hero h-[calc(100vh-60px)] md:h-[calc(100vh-102px)] min-h-[480px] lg:min-h-[550px] 2xl:min-h-[700px]">



            {/* --- BACKGROUND --- */}

            <div ref={parallaxRef} className="absolute -top-[10%] left-0 w-full h-[120%] pointer-events-none z-0 will-change-transform">

                {dataToRender.map((slide, idx) => (

                    <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>

                        <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${currentSlide === idx ? 'scale-110' : 'scale-100'}`}>

                            <Image

                                src={slide.image} alt={slide.title} fill sizes="100vw"

                                priority={idx === 0}

                                // Mobile: load ảnh nhẹ hơn nếu có thể, hoặc giữ quality thấp hơn chút

                                quality={85}

                                className="object-cover"

                            />

                        </div>



                        {/* Gradient: Mobile cần tối hơn chút để đọc chữ dễ hơn */}

                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent md:from-black/80 md:via-black/30"></div>



                        {/* Hotspots: ẨN TRÊN MOBILE (hidden md:block) trong component LuxuryHotspotV2 */}

                        {currentSlide === idx && slide.hotspots?.map((hotspot, hIdx) => (

                            <LuxuryHotspotV2 key={hIdx} data={hotspot} isVisible={hotspotsVisible} delayIndex={hIdx} />

                        ))}

                    </div>

                ))}

            </div>



            {/* --- CONTENT OVERLAY --- */}

            {/* Padding: Mobile px-4, Laptop px-10, Desktop px-20 */}

            <div className="absolute inset-0 z-20 flex items-center px-4 sm:px-8 lg:px-10 2xl:px-20 pointer-events-none">



                {/* WIDTH: Mobile full width, Laptop max-w-2xl */}

                <div className="w-full pointer-events-auto pb-12 sm:pb-0 lg:pb-10 2xl:pb-0 max-w-full lg:max-w-2xl 2xl:max-w-4xl">

                    {dataToRender.map((slide, idx) => (

                        <div key={slide.id} className={`transition-all duration-1000 absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 lg:left-10 2xl:left-20 pr-2 sm:pr-4 ${currentSlide === idx ? 'opacity-100 translate-y-[-55%] 2xl:translate-y-[-50%] blur-0' : 'opacity-0 translate-y-[-45%] blur-sm pointer-events-none'}`}>



                            {/* Subtitle */}

                            <div className="flex items-center gap-2 sm:gap-3 mb-2 lg:mb-3 2xl:mb-6 overflow-hidden">

                                <span className="w-6 sm:w-8 2xl:w-12 h-[2px] bg-amber-400 inline-block"></span>

                                {/* Mobile text-[10px], Laptop text-xs */}

                                <span className="text-amber-400 font-bold tracking-[0.15em] sm:tracking-[0.2em] 2xl:tracking-[0.3em] uppercase text-[10px] lg:text-xs 2xl:text-sm animate-slide-in-right">

                                    {slide.subtitle}

                                </span>

                            </div>



                            {/* Title - MOBILE OPTIMIZED */}

                            {/* Mobile: text-3xl (đủ đọc, ko vỡ). Tablet: text-5xl. Laptop: text-5xl. Desktop: text-8xl */}

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl 2xl:text-8xl font-serif font-bold text-white mb-3 lg:mb-5 2xl:mb-8 leading-[1.15] tracking-tight drop-shadow-2xl max-w-[90%] sm:max-w-full">

                                {slide.title}

                            </h1>



                            {/* Description */}

                            {/* Mobile: text-sm, line-clamp-3 (cắt bớt nếu quá dài) */}

                            <p className="text-slate-200 text-sm lg:text-[13px] 2xl:text-lg font-light max-w-[300px] sm:max-w-md lg:max-w-[400px] 2xl:max-w-lg mb-6 lg:mb-6 2xl:mb-10 leading-relaxed opacity-90 border-l border-white/20 pl-3 sm:pl-4 lg:pl-5 2xl:pl-6 line-clamp-3 md:line-clamp-none">

                                {slide.description}

                            </p>



                            {/* Buttons */}

                            <div className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-6">

                                <Link href={slide.ctaLink || '/shop'}>

                                    {/* Mobile: h-10 px-5 text-[11px]. Laptop: h-10 px-6 */}

                                    <Button className="h-10 px-5 text-[10px] sm:text-xs 2xl:h-14 2xl:px-10 2xl:text-sm font-bold uppercase tracking-widest !bg-amber-400 !text-slate-900 hover:!bg-white hover:!text-slate-900 border-none transition-all shadow-lg whitespace-nowrap">

                                        {slide.ctaText || "Mua Ngay"}

                                    </Button>

                                </Link>

                                <Link href="/projects" className="group flex items-center gap-2 sm:gap-3 text-white font-bold text-[10px] sm:text-xs 2xl:text-sm uppercase tracking-widest hover:text-amber-400 transition-colors">

                                    {/* Icon Play: Mobile w-8 h-8 */}

                                    <span className="w-8 h-8 lg:w-9 lg:h-9 2xl:w-12 2xl:h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-amber-400 group-hover:scale-110 transition-all bg-white/5 backdrop-blur-sm">

                                        <PlayCircle size={14} className="sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 ml-0.5" />

                                    </span>

                                    Dự Án

                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            </div>



            {/* --- NAVIGATION CONTROLS --- */}

            <div className="absolute bottom-0 left-0 right-0 z-30 px-4 sm:px-10 2xl:px-20 py-4 lg:py-6 2xl:py-10 flex items-end justify-between pointer-events-none">

                {/* Slide Counter & Dots */}

                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 2xl:gap-8 pointer-events-auto">

                    {/* Ẩn số trang trên Mobile nhỏ, chỉ hiện Dots */}

                    <div className="text-white font-mono text-xs 2xl:text-sm hidden sm:block">

                        <span className="text-lg lg:text-xl 2xl:text-2xl font-bold">0{currentSlide + 1}</span>

                        <span className="text-white/40 mx-2">/</span>

                        <span className="text-white/40">0{dataToRender.length}</span>

                    </div>

                    <div className="flex gap-2 2xl:gap-3">

                        {dataToRender.map((_, idx) => (

                            <button

                                key={idx}

                                onClick={() => goToSlide(idx)}

                                // Mobile: Dot bé tí để gọn (w-6 vs w-1.5)

                                className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-6 sm:w-8 lg:w-10 2xl:w-16 bg-amber-400' : 'w-1.5 sm:w-2 lg:w-3 2xl:w-4 bg-white/20 hover:bg-white/50'}`}

                            />

                        ))}

                    </div>

                </div>



                {/* PREVIEW BOX & ARROWS: ẨN TRÊN MOBILE */}

                {/* Chỉ hiện từ màn hình md (Tablet) trở lên */}

                <div className="hidden md:flex items-center gap-4 2xl:gap-6 pointer-events-auto">

                    <button onClick={prevSlide} className="w-10 h-10 lg:w-10 lg:h-10 2xl:w-14 2xl:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">

                        <ChevronLeft size={20} className="lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />

                    </button>



                    <div onClick={nextSlide} className="group relative w-32 h-20 lg:w-32 lg:h-20 2xl:w-48 2xl:h-32 rounded-lg 2xl:rounded-xl overflow-hidden cursor-pointer border border-white/20 hover:border-amber-400 transition-colors shadow-2xl">

                        {dataToRender[nextSlideIndex] && (

                            <>

                                <div className="absolute inset-0 w-full h-full">

                                    <Image src={dataToRender[nextSlideIndex].image} alt="Next" fill sizes="200px" className="object-cover group-hover:scale-110 transition-transform duration-700" />

                                </div>

                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors z-10"></div>

                                <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20">

                                    <span className="text-[8px] 2xl:text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">Tiếp theo</span>

                                    <span className="font-serif font-bold text-xs lg:text-xs 2xl:text-lg text-center px-2 line-clamp-1">

                                        {dataToRender[nextSlideIndex].title?.split('\n')[0]}

                                    </span>

                                </div>

                            </>

                        )}

                        <div key={currentSlide} className="absolute bottom-0 left-0 h-1 bg-amber-400 animate-[progress_7s_linear_forwards] w-full origin-left z-30"></div>

                    </div>

                </div>

            </div>

        </section>

    );

};

