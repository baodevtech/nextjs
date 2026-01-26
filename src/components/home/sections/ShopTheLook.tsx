'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/UI';

// Pin Component (Internal)
const ShopTheLookPin: React.FC<{ x: string, y: string, label: string, onClick?: () => void, isActive?: boolean }> = ({ x, y, label, onClick, isActive }) => (
    <div 
        className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-pointer group/pin z-20"
        style={{ left: x, top: y }}
        onClick={onClick}
    >
        <div className={`absolute inset-0 rounded-full animate-ping ${isActive ? 'bg-brand-500/40' : 'bg-white/40'}`}></div>
        <div className={`relative w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] border-2 ring-1 transition-all duration-300 ${isActive ? 'bg-brand-500 border-white ring-brand-200 scale-125' : 'bg-white border-white ring-black/10'}`}></div>
        
        <div className={`absolute left-1/2 bottom-full mb-3 -translate-x-1/2 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:translate-y-0'}`}>
            <div className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded-lg shadow-xl whitespace-nowrap border border-white/50">
                {label}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90 mx-auto"></div>
        </div>
    </div>
);

// Dữ liệu nội bộ cho phần danh sách vật tư
const LOOK_ITEMS = [
    { id: 0, name: 'Tấm Ốp Nano Vân Gỗ', sku: 'N-012', price: '145.000₫/m2', img: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?q=80&w=200&auto=format&fit=crop' },
    { id: 1, name: 'Lam Sóng Trắng Sứ', sku: 'L-305', price: '180.000₫/m2', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=200&auto=format&fit=crop' },
    { id: 2, name: 'Phào Chỉ PS Hàn Quốc', sku: 'P-99', price: '85.000₫/m', img: 'https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=200&auto=format&fit=crop' }
];

export const ShopTheLook = () => {
  const [activeShopLook, setActiveShopLook] = useState(0);

  return (
      <section className="py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">Cảm Hứng Không Gian</h2>
                  <p className="text-slate-500 text-lg">Khám phá các phong cách nội thất xu hướng 2024</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px] lg:h-[600px]">
                  {/* Interactive Image */}
                  <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl group select-none">
                      <img src="https://images.unsplash.com/photo-1595515106967-14348984f548?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Living Room" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                      
                      <ShopTheLookPin x="30%" y="40%" label="Vách Tivi Nano" isActive={activeShopLook === 0} onClick={() => setActiveShopLook(0)} />
                      <ShopTheLookPin x="60%" y="25%" label="Trần Lam Sóng" isActive={activeShopLook === 1} onClick={() => setActiveShopLook(1)} />
                      <ShopTheLookPin x="80%" y="60%" label="Phào Chỉ PS" isActive={activeShopLook === 2} onClick={() => setActiveShopLook(2)} />
                  </div>

                  {/* Material List */}
                  <div className="lg:col-span-4 flex flex-col h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Danh Sách Vật Tư</h3>
                      
                      <div className="flex-1 space-y-4 relative z-10 overflow-y-auto no-scrollbar">
                          {LOOK_ITEMS.map((item, idx) => (
                              <div 
                                key={idx}
                                onClick={() => setActiveShopLook(idx)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${activeShopLook === idx ? 'border-brand-500 bg-brand-50 shadow-md transform scale-[1.02]' : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'}`}
                              >
                                  <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                      <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className={`font-bold text-sm truncate ${activeShopLook === idx ? 'text-brand-700' : 'text-slate-900'}`}>{item.name}</h4>
                                      <p className="text-xs text-slate-500 mt-0.5">{item.sku}</p>
                                      <p className="text-sm font-semibold text-slate-900 mt-1">{item.price}</p>
                                  </div>
                                  {activeShopLook === idx && <div className="w-2 h-2 rounded-full bg-brand-500"></div>}
                              </div>
                          ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
                          <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-slate-500 font-medium">Tổng ước tính</span>
                              <span className="text-xl font-bold text-slate-900">~8.500.000₫</span>
                          </div>
                          <Button fullWidth className="h-12 shadow-lg shadow-brand-500/20">
                              <span className="flex items-center gap-2">Nhận Báo Giá Trọn Gói <ArrowRight size={16}/></span>
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      </section>
  );
};