// src/components/home/sections/LuxuryHotspotV2.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// (Interface HotspotItem giữ nguyên)
export interface HotspotItem {
    x: number | string;
    y: number | string;
    title?: string;
    name?: string;
    price: string;
    productHandle?: string;
    link?: string;
    position?: 'left' | 'right';
}

interface HotspotProps {
    data: HotspotItem;
    isVisible: boolean;
    delayIndex: number;
}

export const LuxuryHotspotV2: React.FC<HotspotProps> = ({ data, isVisible, delayIndex }) => {
    const [isSafeToAnimate, setIsSafeToAnimate] = useState(false);
    
    // Logic xử lý dữ liệu (Giữ nguyên)
    const xVal = parseFloat(String(data.x)); 
    const yVal = parseFloat(String(data.y));
    const productName = data.title || data.name || '';
    const productLink = data.link || (data.productHandle ? `/products/${data.productHandle}` : '#');
    const positionRaw = data.position ? String(data.position).trim().toLowerCase() : '';
    let showContentOnLeft = xVal > 50; 
    if (positionRaw === 'left') showContentOnLeft = true;
    else if (positionRaw === 'right') showContentOnLeft = false;

    const baseDelay = delayIndex * 200 + 1000;

    useEffect(() => {
        const timer = setTimeout(() => setIsSafeToAnimate(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const show = isVisible && isSafeToAnimate;

    return (
        <div 
            className="absolute z-30 hidden md:block pointer-events-auto cursor-pointer"
            style={{ left: `${xVal}%`, top: `${yVal}%` }}
        >
            <div className="relative flex items-center justify-center">
                {/* 1. Điểm chấm tròn (Anchor) */}
                <div 
                    className="absolute z-20 transition-all duration-700 ease-out"
                    style={{
                        opacity: show ? 1 : 0,
                        transform: show ? 'scale(1)' : 'scale(0)',
                        transitionDelay: show ? `${baseDelay}ms` : '0ms'
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Laptop: w-6 (nhỏ), Màn to (2xl): w-8 (lớn) */}
                        <div className="absolute w-6 h-6 2xl:w-8 2xl:h-8 rounded-full bg-white/20 animate-[ping_3s_ease-in-out_infinite]"></div>
                        <div className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] border border-white/50"></div>
                    </div>
                </div>

                {/* 2. Đường kẻ nối */}
                <div 
                    className={`absolute h-[1px] bg-white/50 transition-all duration-700 ease-out z-10 ${showContentOnLeft ? 'right-0 origin-right' : 'left-0 origin-left'}`}
                    style={{
                        top: '0px',
                        width: show ? 'var(--line-width, 60px)' : '0px', 
                        transitionDelay: show ? `${baseDelay + 200}ms` : '0ms'
                    }}
                >
                    {/* CSS: Laptop < 1536px thì dây 35px. Màn to >= 1536px thì dây 60px */}
                    <style jsx>{`
                        @media (max-width: 1535px) { div { --line-width: 35px; } }
                        @media (min-width: 1536px) { div { --line-width: 60px; } }
                    `}</style>
                </div>

                {/* 3. Thẻ thông tin */}
                <div 
                    // Margin: Laptop 35px, Màn to 60px
                    className={`absolute top-1/2 -translate-y-1/2 z-40 transition-all duration-700 ease-out ${showContentOnLeft ? 'right-full mr-[35px] 2xl:mr-[60px]' : 'left-full ml-[35px] 2xl:ml-[60px]'}`}
                    style={{
                        opacity: show ? 1 : 0,
                        transform: show ? 'translateX(0)' : `translateX(${showContentOnLeft ? '20px' : '-20px'})`,
                        transitionDelay: show ? `${baseDelay + 400}ms` : '0ms'
                    }}
                >
                    <Link href={productLink} className="group flex items-stretch cursor-pointer">
                        <div className={`w-1 bg-amber-400 transition-all group-hover:w-1.5 ${showContentOnLeft ? 'order-2 rounded-r-sm' : 'order-1 rounded-l-sm'}`}></div>
                        
                        {/* BOX SIZE:
                            Laptop: min-w-[140px], py-1.5, px-3
                            Màn to (2xl): min-w-[180px], py-2.5, px-4 (Khôi phục size lớn)
                        */}
                        <div className={`bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-2xl hover:bg-slate-900 transition-colors flex flex-col justify-center 
                                        min-w-[140px] py-1.5 px-3 
                                        2xl:min-w-[180px] 2xl:py-2.5 2xl:px-4
                                        ${showContentOnLeft ? 'order-1 rounded-l-sm border-r-0' : 'order-2 rounded-r-sm border-l-0'}`}>
                            
                            {productName && (
                                /* Text Title: Laptop xs, Màn to sm */
                                <h3 className="font-serif text-white font-bold leading-tight tracking-wide whitespace-nowrap
                                            text-xs mb-1
                                            2xl:text-sm 2xl:mb-1.5">
                                    {productName}
                                </h3>
                            )}
                            
                            <div className="flex items-center justify-between gap-3">
                                {/* Price: Laptop text-[10px], Màn to text-[11px] */}
                                <span className="font-mono text-amber-400 font-medium uppercase tracking-wider
                                                text-[10px]
                                                2xl:text-[11px]">
                                    {data.price}
                                </span>
                                <ChevronRight size={14} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};