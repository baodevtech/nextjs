'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Product, SignatureTab } from '@/types';
// Sử dụng ProductCard từ component dùng chung như code gốc của bạn
// Nếu bạn chưa có file này, tôi có thể cung cấp code ProductCard riêng
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
  // [DEBUG LOG] Kiểm tra props
  // console.log("🚀 [Component] Signature Settings:", settings);
  
  const { addToCart } = useCart();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Fallback Data
  const headingNormal = settings?.headingNormal || "Sự Tinh Tế.";
  const headingHighlight = settings?.headingHighlight || "Trong Từng Chi Tiết.";
  const description = settings?.description || "Tuyển tập những mẫu tấm ốp Nano và Lam sóng mới nhất, được chế tác tỉ mỉ để tái định nghĩa không gian sống của bạn.";
  const tabs = settings?.tabs || [];

  // Lấy sản phẩm của tab đang active
  // Nếu chưa có tab nào (tabs rỗng), trả về mảng rỗng để không crash
  const displayedProducts = tabs.length > 0 ? tabs[activeTabIndex].products : [];

  return (
    <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 1. HEADER & TABS */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                
                {/* Tiêu đề & Mô tả */}
                <div className="max-w-2xl">
                    <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6">
                        {headingNormal} <span className="text-slate-400">{headingHighlight}</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                        {description}
                    </p>
                </div>

                {/* Tab Buttons (Dynamic từ ACF) */}
                {tabs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-full">
                        {tabs.map((tab, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveTabIndex(idx)}
                                className={`
                                    px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                                    ${activeTabIndex === idx 
                                        ? 'bg-white text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-900'}
                                `}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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
                    // Trạng thái khi chưa có sản phẩm nào
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-400 italic">
                            Chưa có sản phẩm nào trong danh mục này.
                        </p>
                    </div>
                )}
            </div>

            {/* 3. VIEW ALL LINK */}
            <div className="mt-20 text-center">
                <Link href="/shop" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-lg hover:underline decoration-2 underline-offset-4 group">
                    Xem toàn bộ bộ sưu tập <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    </section>
  );
};