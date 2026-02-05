// src/components/home/sections/LuxuryHotspotV2.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
    
    // Logic xử lý dữ liệu
    const xVal = parseFloat(String(data.x)); 
    const yVal = parseFloat(String(data.y));
    const productName = data.title || data.name || '';
    const productLink = data.link || (data.productHandle ? `/products/${data.productHandle}` : '#');
    const positionRaw = data.position ? String(data.position).trim().toLowerCase() : '';
    let showContentOnLeft = xVal > 50; 
    if (positionRaw === 'left') showContentOnLeft = true;
    else if (positionRaw === 'right') showContentOnLeft = false;

    // Tăng delay nền lên một chút để slide chuyển xong mới hiện hotspot
    const baseDelay = delayIndex * 300 + 800; 

    useEffect(() => {
        const timer = setTimeout(() => setIsSafeToAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const show = isVisible && isSafeToAnimate;

    return (
        <div 
            className="absolute z-30 pointer-events-auto"
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
                        <div className="absolute w-3 h-3 md:w-6 md:h-6 2xl:w-8 2xl:h-8 rounded-full bg-white/20 animate-[ping_3s_ease-in-out_infinite]"></div>
                        <div className="w-1 h-1 md:w-2 md:h-2 2xl:w-2.5 2xl:h-2.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,1)] border border-white/50"></div>
                    </div>
                </div>

                {/* 2. Đường kẻ nối */}
                <div 
                    className={`absolute h-[1px] bg-white/50 transition-all duration-700 ease-out z-10 ${showContentOnLeft ? 'right-0 origin-right' : 'left-0 origin-left'}`}
                    style={{
                        top: '0px',
                        width: show ? 'var(--line-width)' : '0px', 
                        transitionDelay: show ? `${baseDelay + 200}ms` : '0ms'
                    }}
                >
                    <style jsx>{`
                        div { --line-width: 12px; }
                        @media (min-width: 768px) { div { --line-width: 35px; } }
                        @media (min-width: 1536px) { div { --line-width: 60px; } }
                    `}</style>
                </div>

                {/* 3. Thẻ thông tin (SHOW RA LUÔN) */}
                <div 
                    className={`absolute top-1/2 -translate-y-1/2 z-40 transition-all duration-700 ease-out 
                    ${showContentOnLeft 
                        ? 'right-full mr-[12px] md:mr-[35px] 2xl:mr-[60px]' 
                        : 'left-full ml-[12px] md:ml-[35px] 2xl:ml-[60px]'}`}
                    style={{
                        opacity: show ? 1 : 0,
                        transform: show ? 'translateX(0)' : `translateX(${showContentOnLeft ? '10px' : '-10px'})`,
                        transitionDelay: show ? `${baseDelay + 400}ms` : '0ms'
                    }}
                >
                    <Link href={productLink} className="group flex items-stretch cursor-pointer">
                        <div className={`w-[2px] md:w-1 bg-amber-400 transition-all group-hover:w-1 md:group-hover:w-1.5 ${showContentOnLeft ? 'order-2 rounded-r-sm' : 'order-1 rounded-l-sm'}`}></div>
                        
                        <div className={`bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl hover:bg-slate-900 transition-colors flex flex-col justify-center 
                                        min-w-[80px] py-0.5 px-1.5
                                        md:min-w-[140px] md:py-1.5 md:px-3 
                                        2xl:min-w-[180px] 2xl:py-2.5 2xl:px-4
                                        ${showContentOnLeft ? 'order-1 rounded-l-sm border-r-0' : 'order-2 rounded-r-sm border-l-0'}`}>
                            
                            {productName && (
                                <h3 className=" text-white font-bold leading-tight tracking-wide whitespace-nowrap
                                                text-[8px] mb-[2px]
                                                md:text-xs md:mb-1
                                                2xl:text-sm 2xl:mb-1.5">
                                    {productName}
                                </h3>
                            )}
                            
                            <div className="flex items-center justify-between gap-1 md:gap-3">
                                <span className="font-mono text-amber-400 font-medium uppercase tracking-wider
                                                text-[7px]
                                                md:text-[10px]
                                                2xl:text-[11px]">
                                    {data.price}
                                </span>
                                
                                <ChevronRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all 
                                                        w-2 h-2 
                                                        md:w-3.5 md:h-3.5" />
                            </div>
                        </div>                    
                    </Link>
                </div>
            </div>
        </div>
    );
};