'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SignatureTab } from '@/types';
import { ProductCard } from '@/components/product/ProductComponents'; 
import { useCart } from '@/context/CartContext';

interface SignatureProductProps {
  settings?: {
    headingNormal?: string;
    headingHighlight?: string;
    description?: string;
    tabs: SignatureTab[];
  };
}

export const SignatureProduct: React.FC<SignatureProductProps> = ({ settings }) => {
  const { addToCart } = useCart();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Fallback Data
  const headingNormal = settings?.headingNormal || "Sự Tinh Tế.";
  const headingHighlight = settings?.headingHighlight || "Trong Từng Chi Tiết.";
  const description = settings?.description || "Tuyển tập những mẫu tấm ốp Nano và Lam sóng mới nhất, được chế tác tỉ mỉ để tái định nghĩa không gian sống của bạn.";
  const tabs = settings?.tabs || [];

  const displayedProducts = tabs.length > 0 ? tabs[activeTabIndex].products : [];

  return (
    // 1. PADDING: Giảm xuống py-10 trên mobile, giữ py-32 trên PC
    <section className="py-10 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* HEADER & TABS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 md:mb-16 gap-6 md:gap-8">
                
                {/* Tiêu đề & Mô tả */}
                <div className="max-w-2xl w-full">
                    {/* 2. TEXT SIZE: Mobile dùng text-2xl (nhỏ gọn), PC giữ text-6xl */}
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 mb-3 md:mb-6">
                        {headingNormal} <span className="text-slate-400 block sm:inline">{headingHighlight}</span>
                    </h2>
                    {/* Description: Mobile text-sm (nhỏ), PC text-xl */}
                    <p className="text-sm md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                        {description}
                    </p>
                </div>

                {/* Tab Buttons */}
                {tabs.length > 0 && (
                    <div className="w-full lg:w-auto mt-2 lg:mt-0">
                        {/* Scroll ngang trên mobile */}
                        <div className="flex overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar items-center">
                            <div className="flex lg:flex-wrap items-center gap-2 lg:gap-1 lg:bg-slate-100 lg:p-1 rounded-full min-w-max">
                                {tabs.map((tab, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveTabIndex(idx)}
                                        // Button size: nhỏ hơn một chút trên mobile
                                        className={`
                                            px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap
                                            ${activeTabIndex === idx 
                                                ? 'bg-slate-900 text-white lg:bg-white lg:text-slate-900 shadow-md lg:shadow-sm' 
                                                : 'text-slate-500 bg-slate-50 lg:bg-transparent hover:text-slate-900'}
                                        `}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. PRODUCT GRID: 2 CỘT TRÊN MOBILE */}
            {/* grid-cols-2 (mobile) -> lg:grid-cols-4 (PC) */}
            {/* gap-x-3 (mobile - khe hở nhỏ để tiết kiệm chỗ) -> md:gap-x-8 (PC) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-12">
                {displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => (
                        <div key={product.id} className="animate-fade-in">
                            <ProductCard 
                                product={product} 
                                onQuickAdd={() => addToCart(product)} 
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 md:py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-sm md:text-base text-slate-400 italic">
                            Chưa có sản phẩm nào.
                        </p>
                    </div>
                )}
            </div>

            {/* VIEW ALL LINK */}
            <div className="mt-8 md:mt-20 text-center">
                <Link href="/shop" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm md:text-lg hover:underline decoration-2 underline-offset-4 group">
                    Xem toàn bộ bộ sưu tập <ChevronRight size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    </section>
  );
};