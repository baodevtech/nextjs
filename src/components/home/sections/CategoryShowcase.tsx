'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Box, Layers, Hash, ScanLine } from 'lucide-react';
import { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
  settings?: {
    headingNormal?: string;
    headingHighlight?: string;
    subheading?: string;
    catalogueText?: string;
    enableNofollow?: boolean;
  };
}

export const CategoryShowcase = ({ categories, settings }: CategoryShowcaseProps) => {
  // Fallback data nếu settings chưa có (lúc đầu chưa fetch xong)
  const catalogueText = settings?.catalogueText || "Catalogue 2024";
  const headingNormal = settings?.headingNormal || "Danh Mục";
  const headingHighlight = settings?.headingHighlight || "Sản Phẩm";
  const subheading = settings?.subheading || "Khám phá các dòng vật liệu ốp tường đẳng cấp từ Đại Nam Wall.";
  const relAttr = settings?.enableNofollow ? "nofollow" : undefined;
  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden">
      {/* Background: Pattern lưới kỹ thuật mờ (Technical Grid Pattern) */}
     <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header: Giữ nguyên vẻ sang trọng */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
             <div className="inline-flex items-center gap-2 text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
                 <Layers size={12} /> {catalogueText}
             </div>
          {/* Tiêu đề lớn */}
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
                {headingNormal} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800">{headingHighlight}</span>
             </h2>

             {/* Dòng mô tả & Decor */}
             <div className="flex items-center gap-4">
                 <div className="h-[2px] w-12 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
                 <p className="text-slate-500 text-sm font-medium">{subheading}</p>
             </div>
          </div>
          <Link href="/shop" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-2 group bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:shadow-md">
             Xem tất cả <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"/>
          </Link>
        </div>

        {/* COMPACT GRID: 5 CỘT - ROUNDED XL - 180PX */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat, idx) => (
            <Link 
              key={cat.id} 
              href={`/shop?cat=${cat.slug}`} rel={relAttr}
              className="group relative h-[180px] rounded-xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-brand-900/20 transition-all duration-500 border border-slate-200/0 hover:border-brand-500/50"
            >
              {/* 1. LAYER ẢNH NỀN */}
              <div className="absolute inset-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                
                {/* Gradient nền: Đậm ở dưới để đỡ chữ (Always Visible) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent opacity-100 transition-opacity duration-500"></div>
                
                {/* Viền nội thất (Visible Inner Border): Tạo cảm giác đóng khung kỹ thuật */}
                <div className="absolute inset-0 border-[2px] border-white/10 pointer-events-none rounded-xl z-10"></div>
              </div>

              {/* 2. LAYER THÔNG TIN (VISIBLE DETAILS) */}
              <div className="absolute inset-0 p-3.5 flex flex-col justify-between z-20">
                 
                 {/* Top: ID Tag (Luôn hiển thị) */}
                 <div className="flex justify-between items-start">
                    <span className="flex items-center gap-1 bg-slate-950/40 backdrop-blur-md text-white/90 border border-white/10 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider group-hover:bg-amber-500 group-hover:text-slate-900 group-hover:border-amber-500 transition-colors duration-300">
                        <Hash size={9} />
                        0{idx + 1}
                    </span>
                    
                    {/* Icon Scan: Trang trí góc phải */}
                    <ScanLine size={14} className="text-white/30 group-hover:text-amber-400 transition-colors duration-300" />
                 </div>

                 {/* Bottom: Tên & Thông số (Luôn hiển thị rõ ràng) */}
                 <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                     {/* Tên danh mục */}
                     <h3 className="font-serif font-bold text-white text-[15px] leading-tight drop-shadow-md pr-2 mb-2">
                        {cat.name}
                     </h3>
                     
                     {/* Đường kẻ phân cách (Visible Divider) */}
                     <div className="w-8 group-hover:w-full h-[1px] bg-white/30 group-hover:bg-amber-500/80 transition-all duration-500 mb-2"></div>

                     {/* Thông số kỹ thuật */}
                     <div className="flex items-center justify-between text-[10px] text-white/70 font-medium group-hover:text-white transition-colors">
                        <span className="flex items-center gap-1.5">
                            <Box size={10} className="text-amber-500"/> 
                            {cat.count} mẫu
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono uppercase text-amber-400 tracking-wider">
                            {cat.slug.slice(0,3)}
                        </span>
                     </div>
                 </div>
              </div>

              {/* 3. LAYER HOVER (INTERACTION EFFECTS) */}
              
              {/* Nút "Xem" nổi lên ở giữa */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 z-30">
                  <span className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 transition-all shadow-xl">
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                  </span>
              </div>

              {/* Khung Focus 4 góc (Chỉ hiện khi Hover) */}
              <div className="absolute inset-2 pointer-events-none z-10">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/0 group-hover:border-amber-500 transition-all duration-500 shadow-sm"></div>
                 <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/0 group-hover:border-amber-500 transition-all duration-500 shadow-sm"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500/0 group-hover:border-amber-500 transition-all duration-500 shadow-sm"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500/0 group-hover:border-amber-500 transition-all duration-500 shadow-sm"></div>
              </div>

            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};