'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { ShopLookItem } from '@/types';

// --- SUB-COMPONENT 1: Pin (Giữ nguyên logic của bạn) ---
interface PinProps {
    x: number; y: number; label: string; onClick?: () => void; isActive?: boolean;
}
const ShopTheLookPin: React.FC<PinProps> = ({ x, y, label, onClick, isActive }) => (
    <button
        aria-label={`Xem sản phẩm ${label}`}
        className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-pointer group/pin z-20 focus:outline-none"
        style={{ left: `${x}%`, top: `${y}%` }}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
        <span className={`absolute inset-0 rounded-full animate-ping ${isActive ? 'bg-brand-500/60' : 'bg-white/40'}`}></span>
        <span className={`relative w-3 h-3 rounded-full shadow-lg border-2 ring-1 transition-all duration-300 ${isActive ? 'bg-brand-500 border-white ring-brand-200 scale-125' : 'bg-white border-white ring-black/10 group-hover/pin:scale-110'}`}></span>
        
        {/* Tooltip (Chỉ hiện khi active hoặc hover) */}
        <div className={`
            absolute left-1/2 bottom-full mb-3 -translate-x-1/2 transition-all duration-300 z-30
            ${isActive ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible group-hover/pin:visible group-hover/pin:opacity-100 group-hover/pin:translate-y-0'}
        `}>
            <div className="bg-slate-900/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded shadow-xl whitespace-nowrap">
                {label}
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900/90 mx-auto"></div>
        </div>
    </button>
);

// --- SUB-COMPONENT 2: Product Row (Sử dụng Style Rộng Rãi: p-4, w-16) ---
interface ProductRowProps {
    item: ShopLookItem; isActive: boolean; onClick: () => void;
}
const ProductRow = React.forwardRef<HTMLDivElement, ProductRowProps>(({ item, isActive, onClick }, ref) => {
    const { product } = item;
    if (!product) return null;

    return (
        <div 
            ref={ref} onClick={onClick}
            // Style: p-4, gap-4 (Rộng rãi, dễ nhìn)
            className={`
                flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 scroll-mt-24
                ${isActive 
                    ? 'border-brand-500 bg-brand-50/50 shadow-md ring-1 ring-brand-200' 
                    : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'}
            `}
        >
            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                <img src={product.image?.sourceUrl} className="w-full h-full object-cover" alt={product.name} loading="lazy"/>
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm truncate ${isActive ? 'text-brand-700' : 'text-slate-900'}`}>
                    {product.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{product.brand || 'Đại Nam Wall'}</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                    {product.price?.formatted || 'Liên hệ'}
                </p>
            </div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {isActive ? <ArrowRight size={16} /> : <ShoppingBag size={16} />}
            </div>
        </div>
    );
});
ProductRow.displayName = 'ProductRow';

// --- MAIN COMPONENT ---
interface ShopTheLookProps {
  settings?: { heading?: string; subheading?: string; image?: string; items: ShopLookItem[]; };
}

export const ShopTheLook = ({ settings }: ShopTheLookProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Data props
  const heading = settings?.heading || "Cảm Hứng Không Gian";
  const subheading = settings?.subheading || "Khám phá các phong cách nội thất xu hướng mới nhất.";
  const bgImage = settings?.image || "https://images.unsplash.com/photo-1595515106967-14348984f548?q=80&w=2000&auto=format&fit=crop";
  const items = settings?.items || [];
  const activeProduct = items[activeIdx]?.product;

  // Logic Scroll: Auto scroll khi activeIdx thay đổi
  useEffect(() => {
    if (items.length > 0 && itemRefs.current[activeIdx]) {
        itemRefs.current[activeIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIdx, items.length]);

  const totalPriceFormatted = useMemo(() => {
    const total = items.reduce((sum, item) => sum + (item.product?.price?.amount || 0), 0);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
  }, [items]);

  return (
      // 1. OUTER SECTION: Fullscreen PC & Mobile
      // h-[calc(100vh-64px)] -> Trừ header để vừa khít màn hình
      <section className="bg-slate-50 h-[calc(100vh-64px)] overflow-hidden w-full relative">
          
          <div className="h-full w-full max-w-[1440px] mx-auto px-0 md:px-6 lg:px-8 py-0 md:py-6 flex flex-col">
              
              {/* Header: Chỉ hiện trên PC */}
              <div className="hidden md:block mb-4 md:mb-6 shrink-0 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-slate-900">{heading}</h2>
                  <p className="text-slate-500 mt-1">{subheading}</p>
              </div>

              {/* BODY CONTENT: Grid Layout */}
              <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-12 md:gap-8 lg:gap-10">
                  
                  {/* --- LEFT: IMAGE (Mobile: 40% height, PC: Full height) --- */}
                  <div className="relative shrink-0 md:col-span-8 lg:col-span-8 bg-slate-200 overflow-hidden select-none
                                  h-[40%] md:h-full w-full
                                  md:rounded-3xl shadow-sm group"> 
                      <img src={bgImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={heading} />
                      <div className="absolute inset-0 bg-black/10 transition-colors duration-500"></div>

                      {/* Mobile Floating Header (Nổi trên ảnh) */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg md:hidden z-10 border border-white/50">
                          <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">{heading}</span>
                      </div>

                      {items.map((item, idx) => (
                          <ShopTheLookPin 
                            key={idx} x={item.x} y={item.y} 
                            label={item.product?.name || ''} isActive={activeIdx === idx} onClick={() => setActiveIdx(idx)} 
                          />
                      ))}
                  </div>

                  {/* --- RIGHT: LIST (Mobile: Flex-1, PC: Full height) --- */}
                  <div className="md:col-span-4 lg:col-span-4 flex flex-col h-full min-h-0 relative z-10">
                      
                      {/* Container Trắng chứa list */}
                      <div className="flex-1 flex flex-col bg-white w-full h-full overflow-hidden
                                      md:rounded-3xl md:border border-slate-100 md:shadow-xl
                                      rounded-t-3xl -mt-6 md:mt-0 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] md:shadow-none">
                          
                          {/* Decoration Blob (Chỉ hiện trên PC cho đẹp) */}
                          <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                          {/* Mobile Handle Bar */}
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto my-4 md:hidden shrink-0"></div>

                          {/* Title List */}
                          <div className="px-6 pb-2 pt-2 md:pt-6 flex justify-between items-center shrink-0 relative z-10">
                            <h3 className="text-lg font-bold text-slate-900">Danh Sách Vật Tư</h3>
                            <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500">{items.length} món</span>
                          </div>
                          
                          {/* SCROLLABLE LIST: Padding lớn (px-4 md:px-6) */}
                          <div className="flex-1 overflow-y-auto px-4 md:px-6 space-y-3 pb-4 custom-scrollbar relative z-10">
                              {items.length > 0 ? (
                                  items.map((item, idx) => (
                                      <ProductRow 
                                        key={idx} ref={(el) => { itemRefs.current[idx] = el }} item={item}
                                        isActive={activeIdx === idx} onClick={() => setActiveIdx(idx)}
                                      />
                                  ))
                              ) : (
                                  <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                                      <ShoppingBag size={32} className="mb-2 opacity-50"/>
                                      <span>Chưa có sản phẩm nào.</span>
                                  </div>
                              )}
                          </div>

                          {/* FOOTER ACTIONS */}
                          <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 pb-safe md:pb-6 relative z-10">
                              <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-medium text-slate-500">Tổng tạm tính:</span>
                                  <span className="text-xl font-bold text-brand-600">{totalPriceFormatted}</span>
                              </div>

                              {activeProduct ? (
                                 <Link href={`/product/${activeProduct.slug}`} className="block">
                                    <Button fullWidth className="h-12 shadow-lg shadow-brand-500/20 text-base font-semibold">
                                        <span className="flex items-center gap-2">Xem Chi Tiết <ArrowRight size={18}/></span>
                                    </Button>
                                 </Link>
                              ) : (
                                 <Button fullWidth disabled className="h-12 opacity-50">Vui lòng chọn</Button>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
  );
};