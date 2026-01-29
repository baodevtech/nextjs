'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface HotspotProps {
    data: { 
        x: string; 
        y: string; 
        name: string; 
        price: string; 
        position?: string; // 'left' | 'right' từ ACF
        link?: string;
        nofollow?: boolean;
    };
    isVisible: boolean;
    delayIndex: number;
}

export const LuxuryHotspotV2: React.FC<HotspotProps> = ({ data, isVisible, delayIndex }) => {
const [isSafeToAnimate, setIsSafeToAnimate] = useState(false);
    
    // --- FIX LOGIC: CHUẨN HÓA DỮ LIỆU ---
    
    // 1. Chuẩn hóa chuỗi: Xóa khoảng trắng thừa và chuyển về chữ thường
    const positionRaw = data.position ? String(data.position).trim().toLowerCase() : '';
    
    // 2. Logic mặc định: Nếu > 50% thì hiện trái, ngược lại hiện phải
    let showContentOnLeft = parseFloat(data.x) > 50;

    // 3. Ưu tiên cấu hình từ CMS (đã chuẩn hóa)
    if (positionRaw === 'left') {
        showContentOnLeft = true;
    } else if (positionRaw === 'right') {
        showContentOnLeft = false;
    }
    // ------------------------------------

    const baseDelay = delayIndex * 200 + 1000;
    const hasLink = Boolean(data.link && data.link.trim() !== '');
    const relAttributes = data.nofollow ? "nofollow noopener noreferrer" : undefined;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSafeToAnimate(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const show = isVisible && isSafeToAnimate;

    return (
        <div 
            className={`absolute z-30 hidden md:block pointer-events-auto cursor-pointer`}
            style={{ 
                left: data.x, 
                top: data.y,
            }}
        >
            <div className="relative flex items-center justify-center">
                
                {/* 1. THE ANCHOR */}
                <div 
                    className="absolute z-20 transition-all duration-700 ease-out"
                    style={{
                        opacity: show ? 1 : 0,
                        transform: show ? 'scale(1)' : 'scale(0)',
                        transitionDelay: show ? `${baseDelay}ms` : '0ms'
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-8 h-8 rounded-full bg-white/20 animate-[ping_3s_ease-in-out_infinite]"></div>
                        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] border border-white/50"></div>
                    </div>
                </div>

                {/* 2. THE CONNECTING LINE */}
                <div 
                    className={`
                        absolute h-[1px] bg-white/50 transition-all duration-700 ease-out z-10
                        ${showContentOnLeft ? 'right-0 origin-right' : 'left-0 origin-left'}
                    `}
                    style={{
                        top: '0px',
                        width: show ? '50px' : '0px',
                        transitionDelay: show ? `${baseDelay + 200}ms` : '0ms'
                    }}
                />

                {/* 3. THE INFO LABEL */}
                <div 
                    className={`
                        absolute top-1/2 -translate-y-1/2 z-40
                        transition-all duration-700 ease-out
                        ${showContentOnLeft ? 'right-full mr-[50px]' : 'left-full ml-[50px]'}
                    `}
                    style={{
                        opacity: show ? 1 : 0,
                        transform: show 
                            ? 'translateX(0)' 
                            : `translateX(${showContentOnLeft ? '20px' : '-20px'})`,
                        transitionDelay: show ? `${baseDelay + 400}ms` : '0ms'
                    }}
                >
                    <Link  href={hasLink ? data.link : ''} className="group flex items-stretch cursor-pointer" rel={relAttributes}>
                        
                        {/* Thanh màu điểm nhấn */}
                        <div className={`w-1 bg-amber-400 transition-all group-hover:w-1.5 ${showContentOnLeft ? 'order-2 rounded-r-sm' : 'order-1 rounded-l-sm'}`}></div>
                        
                        {/* Nội dung chính */}
                        <div className={`
                            bg-slate-900/90 backdrop-blur-md border border-white/10 py-3 px-4 shadow-2xl min-w-[200px] hover:bg-slate-900 transition-colors
                            ${showContentOnLeft ? 'order-1 rounded-l-sm border-r-0' : 'order-2 rounded-r-sm border-l-0'}
                        `}>
                            
                             <h3 className="font-serif text-white text-sm font-bold leading-tight mb-1 tracking-wide">
                                {data.name}
                            </h3>
                            
                            {/* Giá & Icon */}
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[10px] font-mono text-amber-400 font-medium uppercase tracking-wider">
                                    {data.price}
                                </span>
                                <ChevronRight size={12} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};