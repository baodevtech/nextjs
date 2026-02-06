'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { Category } from '@/types';

// --- PHẦN 1: APPLE-STYLE FEATURE BAR ---
// Tinh tế, font nhỏ, icon mảnh, màu xám trung tính
const FeatureBar = () => {
  const features = [
    { icon: <Truck strokeWidth={1.5} size={18} />, text: "Free Shipping over $200" },
    { icon: <RotateCcw strokeWidth={1.5} size={18} />, text: "Free Returns" },
    { icon: <ShieldCheck strokeWidth={1.5} size={18} />, text: "Secure Payment" },
    { icon: <Headphones strokeWidth={1.5} size={18} />, text: "24/7 Support" },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="
            flex items-center gap-8 py-3 overflow-x-auto scrollbar-hide snap-x
            md:justify-center md:gap-12
        ">
          {features.map((item, index) => (
            <div key={index} className="flex items-center gap-2 shrink-0 snap-center opacity-80 hover:opacity-100 transition-opacity">
              <div className="text-[#1d1d1f]">{item.icon}</div>
              <span className="text-[11px] md:text-xs font-medium text-[#424245] tracking-tight whitespace-nowrap">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- PHẦN 2: APPLE-STYLE CATEGORY GRID ---
interface CategoryShowcaseProps {
  categories: Category[];
}

export const CategoryShowcase = ({ categories }: CategoryShowcaseProps) => {
  return (
    <section className="pt-8 pb-16 bg-white">
      
      {/* Feature Bar (Có thể đặt ở Layout cha nếu muốn nó sticky toàn trang) */}
      <div className="mb-10">
        <FeatureBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER: Typography chuẩn Apple (San Francisco style) */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Browse by Category
          </h2>
          <Link href="/shop" className="group flex items-center text-sm font-medium text-[#0066cc] hover:underline hover:decoration-1 underline-offset-4 transition-all">
            See All <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="
            /* MOBILE: 2 Rows, Horizontal Scroll */
            grid 
            grid-rows-2 
            grid-flow-col 
            auto-cols-[80px] /* Chiều rộng tối ưu cho cảm giác 'thoáng' */
            gap-x-4 gap-y-8  /* Gap Y lớn hơn để tách biệt rõ tên và ảnh hàng dưới */
            
            overflow-x-auto 
            scrollbar-hide 
            snap-x snap-mandatory 
            
            /* Padding bottom để tránh cắt text */
            pb-4
            
            /* DESKTOP: Reset về Grid chuẩn */
            md:grid-rows-none md:grid-flow-row 
            md:grid-cols-6 md:auto-cols-auto md:gap-10
        ">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/shop?cat=${cat.slug}`}
              className="group flex flex-col items-center gap-3 snap-start cursor-pointer"
            >
              {/* CONTAINER ẢNH: Màu nền #F5F5F7 (Signature Apple Gray) */}
              <div className="
                  relative 
                  w-[80px] h-[80px] md:w-[160px] md:h-[160px] 
                  bg-[#F5F5F7] /* Màu nền đặc trưng Apple */
                  rounded-[20px] md:rounded-[32px] /* Bo góc lớn (Squircle) */
                  flex items-center justify-center 
                  overflow-hidden
                  transition-all duration-500 ease-out
                  
                  /* Hiệu ứng Scale nhẹ nhàng khi hover, không đổi màu nền */
                  group-hover:scale-105 
              ">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={140} 
                  height={140}
                  // Mix-blend-multiply giúp ảnh hòa vào nền xám nếu ảnh có nền trắng
                  className="object-contain w-3/5 h-3/5 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {/* TÊN DANH MỤC */}
              {/* Font Inter/System, tracking-tight, màu gần đen */}
              <h3 className="
                text-center font-medium text-[#1d1d1f] 
                text-[11px] md:text-sm tracking-tight
                leading-snug
                w-full truncate px-1
                group-hover:text-[#0066cc] transition-colors duration-300
              ">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};