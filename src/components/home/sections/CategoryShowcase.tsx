'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  ChevronLeft, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Headphones 
} from 'lucide-react';

// --- 1. DEFINITIONS ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

// Interface chính xác bạn yêu cầu
export interface CategoryShowcaseProps {
  categories: Category[];
  settings?: {
    headingNormal?: string;      // Phần chữ đen (VD: "Store.")
    headingHighlight?: string;   // Phần chữ xám (VD: "Browse by Category.")
    subheading?: string;         // Mô tả nhỏ bên dưới
    catalogueText?: string;      // Chữ nút xem thêm (VD: "See All")
    enableNofollow?: boolean;    // SEO: rel="nofollow"
  };
}

// --- 2. COMPONENT: FEATURE BAR (Giữ nguyên thiết kế kính mờ sang trọng) ---
const FeatureBar = () => {
  const features = [
    { 
      icon: <Truck strokeWidth={1.5} size={22} />, 
      title: "Free Shipping", 
      desc: "On orders over $200" 
    },
    { 
      icon: <RotateCcw strokeWidth={1.5} size={22} />, 
      title: "1 & 1 Returns", 
      desc: "Cancel after 1 day" 
    },
    { 
      icon: <ShieldCheck strokeWidth={1.5} size={22} />, 
      title: "100% Secure", 
      desc: "Secure payments" 
    },
    { 
      icon: <Headphones strokeWidth={1.5} size={22} />, 
      title: "24/7 Support", 
      desc: "Anywhere & anytime" 
    },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100/50 py-4 md:py-6 sticky top-0 z-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="
            flex items-center 
            justify-between 
            overflow-x-auto scrollbar-hide snap-x snap-mandatory
            lg:justify-between lg:gap-8
        ">
          {features.map((item, index) => (
            <div key={index} className="
                flex items-center gap-3 
                min-w-[200px] lg:min-w-0 
                snap-start pl-4 first:pl-0 lg:pl-0
                group cursor-default
            ">
              <div className="text-[#1d1d1f] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#0066CC]">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] md:text-sm font-bold text-[#1d1d1f] tracking-tight leading-tight">
                  {item.title}
                </span>
                <span className="text-[10px] md:text-[11px] text-gray-500 font-medium mt-0.5 tracking-wide">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 3. COMPONENT: SECTION HEADER (Xử lý headingNormal & Highlight) ---
interface SectionHeaderProps {
  settings: CategoryShowcaseProps['settings'];
}

const SectionHeader = ({ settings }: SectionHeaderProps) => {
  // Giá trị mặc định
  const headingNormal = settings?.headingNormal || "Store.";
  const headingHighlight = settings?.headingHighlight || "Browse by Category.";
  const subheading = settings?.subheading;
  const catalogueText = settings?.catalogueText || "See All";
  const isNofollow = settings?.enableNofollow;

  return (
    <div className="flex items-end justify-between mb-8 px-2">
      
      {/* Title Area */}
      <div className="flex flex-col">
        <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight text-[#1d1d1f] leading-tight">
          {headingNormal} <span className="text-[#86868b] font-semibold">{headingHighlight}</span>
        </h2>
        {/* Subheading nếu có */}
        {subheading && (
          <span className="text-[13px] md:text-[15px] text-[#86868b] mt-1 font-medium tracking-normal">
            {subheading}
          </span>
        )}
      </div>

      {/* Actions Area */}
      <div className="flex items-center gap-4">
        
        {/* Mobile Link */}
        <Link 
          href="/shop" 
          rel={isNofollow ? "nofollow" : undefined}
          className="md:hidden text-[13px] font-medium text-[#0066CC] hover:underline flex items-center whitespace-nowrap"
        >
          {catalogueText} <ChevronRight size={12} className="ml-0.5" />
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            className="w-9 h-9 rounded-full bg-[#F5F5F7] text-gray-400 flex items-center justify-center cursor-not-allowed"
            disabled
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          <Link href="/shop" rel={isNofollow ? "nofollow" : undefined}>
            <button 
              className="
                w-9 h-9 rounded-full bg-[#e8e8ed] text-[#1d1d1f] 
                flex items-center justify-center 
                hover:bg-[#1d1d1f] hover:text-white hover:scale-105
                transition-all duration-300 shadow-sm
              "
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

// --- 4. MAIN COMPONENT: CATEGORY SHOWCASE ---
export const CategoryShowcase = ({ categories, settings }: CategoryShowcaseProps) => {
  const isNofollow = settings?.enableNofollow;

  return (
    <section className="bg-white">
      
      <FeatureBar />

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* Truyền settings xuống Header */}
        <SectionHeader settings={settings} />

        {/* Grid Layout (Mobile 4 - PC 6) */}
        <div className="
            grid 
            grid-cols-4 
            gap-x-2 gap-y-6
            md:grid-cols-5 
            md:gap-6
            lg:grid-cols-6 
            lg:gap-10
        ">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/shop?cat=${cat.slug}`}
              rel={isNofollow ? "nofollow" : undefined}
              className="group flex flex-col items-center gap-3 cursor-pointer w-full"
            >
              {/* Image Container: Circular Apple Style */}
              <div className="
                  relative 
                  w-full aspect-square 
                  max-w-[72px] md:max-w-[140px] 
                  bg-[#F5F5F7] 
                  rounded-full 
                  flex items-center justify-center 
                  mx-auto
                  overflow-hidden
                  transition-all duration-500 ease-out
                  group-hover:scale-105
                  group-hover:shadow-lg group-hover:shadow-gray-200/50
              ">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={140} 
                  height={140}
                  className="
                    object-contain 
                    w-[55%] h-[55%] 
                    mix-blend-multiply 
                    opacity-85 group-hover:opacity-100 
                    transition-all duration-500
                    group-hover:scale-110 
                  "
                />
              </div>

              {/* Category Name */}
              <h3 className="
                text-center font-semibold text-[#1d1d1f] 
                text-[10px] leading-tight 
                w-full px-0.5 line-clamp-2 break-words
                md:text-[14px] md:mt-1
                group-hover:text-[#0066CC] transition-colors duration-300
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