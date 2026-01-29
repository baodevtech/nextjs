'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { ShopLookItem } from '@/types';

// --- SUB-COMPONENT: Pin Trên Ảnh ---
const ShopTheLookPin: React.FC<{ 
    x: number, 
    y: number, 
    label: string, 
    onClick?: () => void, 
    isActive?: boolean 
}> = ({ x, y, label, onClick, isActive }) => (
    <div 
        className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-pointer group/pin z-20"
        style={{ left: `${x}%`, top: `${y}%` }}
        onClick={onClick}
    >
        {/* Hiệu ứng lan tỏa (Pulse) */}
        <div className={`absolute inset-0 rounded-full animate-ping ${isActive ? 'bg-brand-500/40' : 'bg-white/40'}`}></div>
        
        {/* Lõi của Pin */}
        <div className={`relative w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] border-2 ring-1 transition-all duration-300 ${isActive ? 'bg-brand-400 border-white ring-brand-200 scale-125' : 'bg-white border-white ring-black/10'}`}></div>

        {/* Tooltip Tên sản phẩm */}
        <div className={`
            absolute left-1/2 bottom-full mb-3 -translate-x-1/2 transition-all duration-300 
            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:translate-y-0'}
        `}>
            <div className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded-lg shadow-xl whitespace-nowrap border border-white/50">
                {label}
            </div>
            {/* Mũi tên tooltip */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/95 mx-auto"></div>
        </div>
    </div>
);

// --- COMPONENT CHÍNH ---
interface ShopTheLookProps {
  settings?: {
    heading?: string;
    subheading?: string;
    image?: string;
    items: ShopLookItem[];
  };
}

export const ShopTheLook = ({ settings }: ShopTheLookProps) => {
  // State quản lý item đang active (highlight)
  // Mặc định chọn item đầu tiên (index 0) nếu có
  const [activeIdx, setActiveIdx] = useState(0);

  // Fallback Data an toàn
  const heading = settings?.heading || "Cảm Hứng Không Gian";
  const subheading = settings?.subheading || "Khám phá các phong cách nội thất xu hướng mới nhất.";
  const bgImage = settings?.image || "https://images.unsplash.com/photo-1595515106967-14348984f548?q=80&w=2000&auto=format&fit=crop";
  const items = settings?.items || [];
    // --- [TÍNH TỔNG TIỀN] ---
  const totalPriceFormatted = useMemo(() => {
    // Cộng dồn field amount (số) của từng sản phẩm
    const total = items.reduce((sum, item) => {
        // Kiểm tra an toàn: nếu price.amount tồn tại thì cộng, không thì cộng 0
        return sum + (item.product?.price?.amount || 0);
    }, 0);

    // Format sang tiền Việt (VND)
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
  }, [items]);
  // Tính tổng giá ước tính (chỉ mang tính minh họa nếu data price là string không parse được)
  // Logic này có thể nâng cấp sau nếu bạn có trường price dạng số.
  
  return (
      <section className="py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">{heading}</h2>
                  <p className="text-slate-500 text-lg">{subheading}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px] lg:h-[600px]">
                  
                  {/* LEFT: Interactive Image (Chiếm 8 phần) */}
                  <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl group select-none bg-slate-200">
                      <img 
                        src={bgImage} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        alt={heading} 
                      />
                      {/* Overlay tối nhẹ khi hover */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                      
                      {/* Render Pins từ dữ liệu động */}
                      {items.map((item, idx) => (
                          <ShopTheLookPin 
                            key={idx}
                            x={item.x} 
                            y={item.y} 
                            label={item.product?.name || 'Sản phẩm'} 
                            isActive={activeIdx === idx} 
                            onClick={() => setActiveIdx(idx)} 
                          />
                      ))}
                  </div>

                  {/* RIGHT: Material List (Chiếm 4 phần) */}
                  <div className="lg:col-span-4 flex flex-col h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                      {/* Decoration Blob */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Danh Sách Vật Tư</h3>
                      
                      {/* Scrollable List */}
                      <div className="flex-1 space-y-4 relative z-10 overflow-y-auto custom-scrollbar pr-2">
                          {items.length > 0 ? (
                              items.map((item, idx) => {
                                const { product } = item;
                                const isActive = activeIdx === idx;
                                
                                // Nếu sản phẩm lỗi thì không render dòng này
                                if (!product) return null;

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => setActiveIdx(idx)}
                                        className={`
                                            flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300
                                            ${isActive 
                                                ? 'border-brand-400 bg-brand-50 shadow-md transform scale-[1.02]' 
                                                : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'}
                                        `}
                                    >
                                        {/* Product Image */}
                                        <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                                            <img 
                                                src={product.image?.sourceUrl || 'https://via.placeholder.com/150'} 
                                                className="w-full h-full object-cover" 
                                                alt={product.name} 
                                            />
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-bold text-sm truncate ${isActive ? 'text-brand-700' : 'text-slate-900'}`}>
                                                {product.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{product.brand || 'Đại Nam Wall'}</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                                {product.price?.formatted || 'Liên hệ'}
                                            </p>
                                        </div>
                                        
                                        {/* Active Dot Indicator */}
                                        {isActive && <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div>}
                                    </div>
                                );
                              })
                          ) : (
                              <div className="text-center text-slate-400 italic py-10">
                                  Chưa có sản phẩm nào được gắn.
                              </div>
                          )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
                          {/* Dòng tổng tiền (nếu muốn ẩn thì xóa div này) */}
                          <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-slate-500 font-medium">Tổng ước tính</span>
                              <span className="text-xl font-bold text-brand-600">
                                  {totalPriceFormatted}
                              </span>
                          </div>

                          {/* Nút Xem Chi Tiết sản phẩm đang chọn */}
                          {items[activeIdx]?.product && (
                             <Link href={`/product/${items[activeIdx].product.slug}`} className="block">
                                <Button fullWidth className="h-12 shadow-lg shadow-brand-500/20  hover:!bg-brand-400 hover:!text-slate-900 transition-colors">
                                    <span className="flex items-center gap-2">Xem Chi Tiết Sản Phẩm <ArrowRight size={16}/></span>
                                </Button>
                             </Link>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </section>
  );
};