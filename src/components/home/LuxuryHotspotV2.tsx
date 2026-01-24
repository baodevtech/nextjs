'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface HotspotProps {
    data: { x: string, y: string, name: string, price: string, position?: string };
    isVisible: boolean;
    delayIndex: number;
}

export const LuxuryHotspotV2: React.FC<HotspotProps> = ({ data, isVisible, delayIndex }) => {
    // FIX: Thêm state nội bộ để kiểm soát quá trình mount
    const [isSafeToAnimate, setIsSafeToAnimate] = useState(false);

    // Xác định hướng mở của thẻ
    const isRightSide = parseFloat(data.x) > 50;

    // Tính toán delay animation
    const baseDelay = delayIndex * 200 + 1000; // Xuất hiện sau khi slide load 1s

    // FIX: Effect này ngăn chặn hiện tượng "nháy" (flash) khi chuyển slide.
    // Nó đảm bảo component luôn khởi đầu ở trạng thái ẩn trong 50ms đầu tiên,
    // bất chấp prop 'isVisible' từ cha có đang là true hay không.
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSafeToAnimate(true);
        }, 50); // 50ms là đủ để React xả hết các update cũ
        return () => clearTimeout(timer);
    }, []);

    // Logic hiển thị mới: Chỉ hiện khi cha cho phép VÀ component đã ổn định
    const show = isVisible && isSafeToAnimate;

    return (
        <div 
            className={`absolute z-30 hidden md:block`}
            style={{ 
                left: data.x, 
                top: data.y,
            }}
        >
            <div className="relative flex items-center justify-center">
                
                {/* 1. THE ANCHOR (Điểm neo - Tâm toạ độ) */}
                <div 
                    className="absolute z-20 transition-all duration-700 ease-out"
                    style={{
                        opacity: show ? 1 : 0,
                        transform: show ? 'scale(1)' : 'scale(0)',
                        // Chỉ áp dụng delay khi hiện ra, khi ẩn thì ẩn ngay lập tức
                        transitionDelay: show ? `${baseDelay}ms` : '0ms'
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Vòng sáng lan toả (Pulse Ring) */}
                        <div className="absolute w-8 h-8 rounded-full bg-white/20 animate-[ping_3s_ease-in-out_infinite]"></div>
                        {/* Tâm điểm */}
                        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] border border-white/50"></div>
                    </div>
                </div>

                {/* 2. THE CONNECTING LINE (Đường dẫn) */}
                {/* Luôn hiển thị đường kẻ nối từ tâm ra thẻ */}
                <div 
                    className={`
                        absolute h-[1px] bg-white/50 transition-all duration-700 ease-out z-10
                        ${isRightSide ? 'right-0 origin-right' : 'left-0 origin-left'}
                    `}
                    style={{
                        top: '0px',
                        width: show ? '40px' : '0px', // Đường kẻ tự vẽ ra dài 40px
                        transitionDelay: show ? `${baseDelay + 200}ms` : '0ms'
                    }}
                />

                {/* 3. THE INFO LABEL (Thẻ thông tin - Luôn hiện) */}
                <div 
                    className={`
                        absolute top-1/2 -translate-y-1/2 
                        transition-all duration-700 ease-out
                        ${isRightSide ? 'right-full mr-[40px]' : 'left-full ml-[40px]'}
                    `}
                    style={{
                        opacity: show ? 1 : 0,
                        // Hiệu ứng trượt nhẹ vào vị trí
                        transform: show 
                            ? 'translateX(0)' 
                            : `translateX(${isRightSide ? '20px' : '-20px'})`,
                        transitionDelay: show ? `${baseDelay + 400}ms` : '0ms'
                    }}
                >
                    {/* DESIGN MỚI: Architectural Label 
                       Gọn gàng, nền tối mờ, border mảnh
                    */}
                    <Link href="/shop" className="group flex items-stretch">
                        
                        {/* Thanh màu điểm nhấn (Accent Bar) */}
                        <div className="w-1 bg-amber-400 rounded-l-sm"></div>
                        
                        {/* Nội dung chính */}
                        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 border-l-0 py-2.5 px-4 rounded-r-sm shadow-xl min-w-[180px] hover:bg-slate-900 transition-colors">
                            
                            {/* Tên sản phẩm */}
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