'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Scissors } from 'lucide-react';
import { Product, AccessoryHighlight } from '@/types';
import { ProductCard } from '@/components/product/ProductComponents';
import { useCart } from '@/context/CartContext';

interface AccessoriesSectionProps {
  settings?: {
    headNormal?: string;
    headHighlight?: string;
    phuKienSub?: string;
    highlights: AccessoryHighlight[];
    viewAll: { text: string; sub: string; link: string };
    prodHeading: string;
    products: Product[];
  };
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({ settings }) => {
  const { addToCart } = useCart();

  // Fallback Data
  const headNormal = settings?.headNormal || 'Chi Tiết.';
  const headHighlight = settings?.headHighlight || 'Định Hình Đẳng Cấp.';
  const phuKienSub = settings?.phuKienSub || 'Hệ thống phụ kiện nẹp, phào chỉ và keo dán chuyên dụng.';
  const highlights = settings?.highlights || [];
  const viewAll = settings?.viewAll || { text: 'Xem Tất Cả Phụ Kiện', sub: 'Hơn 50+ loại...', link: '/shop' };
  const prodHeading = settings?.prodHeading || 'SẢN PHẨM PHỔ BIẾN';
  const products = settings?.products || [];

  const cardLarge = highlights[0] || { title: 'Nẹp Trang Trí', subtitle: 'Điểm nhấn sang trọng', image: '', link: '#' };
  const cardSmall1 = highlights[1] || { title: 'Phào Chỉ', subtitle: 'Đường nét tinh tế', image: '', link: '#' };
  const cardSmall2 = highlights[2] || { title: 'Keo Dán', subtitle: 'Độ bền vượt trội', image: '', link: '#' };

  return (
    <section className="py-12 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-3 md:mb-4">
                    {headNormal} <span className="text-slate-400 block sm:inline">{headHighlight}</span>
                </h2>
                <p className="text-sm md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl text-left">
                    {phuKienSub}
                </p>
            </div>
            {/* Link Header: Chỉ hiện trên PC (hidden md:flex) */}
            <Link 
                href={viewAll.link} 
                className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 hover:border-slate-900 pb-1 transition-all whitespace-nowrap"
            >
                Xem tất cả phụ kiện <ArrowRight size={16} />
            </Link>
        </div>

        {/* 2. BENTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            
            {/* [A] Card Lớn: Mobile h-[240px] */}
            <Link href={cardLarge.link} className="col-span-2 group relative h-[240px] md:h-[400px] bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 block">
                <img 
                    src={cardLarge.image || 'https://via.placeholder.com/800x600'} 
                    alt={cardLarge.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-2 inline-block shadow-sm">Luxury</span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 font-serif">{cardLarge.title}</h3>
                    <p className="text-slate-200 mb-3 opacity-90 max-w-sm text-xs md:text-sm leading-relaxed line-clamp-2">
                        {cardLarge.subtitle}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1">
                        Xem ngay <ArrowRight size={12} />
                    </span>
                </div>
            </Link>

            {/* [B] Card Nhỏ 1: Mobile h-[180px] */}
            <Link href={cardSmall1.link} className="group relative h-[180px] md:h-[400px] bg-white rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 block">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <img 
                        src={cardSmall1.image || 'https://via.placeholder.com/400x600'} 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" 
                        alt={cardSmall1.title}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-0.5 line-clamp-1">{cardSmall1.title}</h3>
                    <p className="text-xs md:text-sm text-slate-200 opacity-80 line-clamp-1">{cardSmall1.subtitle}</p>
                </div>
            </Link>
            
            {/* [C] Card Nhỏ 2: Mobile h-[180px] */}
            <Link href={cardSmall2.link} className="group relative h-[180px] md:h-[300px] bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 block">
                <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity">
                    <img 
                        src={cardSmall2.image || 'https://via.placeholder.com/400x300'} 
                        className="w-full h-full object-cover" 
                        alt={cardSmall2.title}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <Scissors className="text-white/50 w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-0.5 line-clamp-1">{cardSmall2.title}</h3>
                    <p className="text-xs md:text-sm text-slate-300 line-clamp-1">{cardSmall2.subtitle}</p>
                </div>
            </Link>

            {/* [D] Card Xem Tất Cả: 
                THAY ĐỔI QUAN TRỌNG: thêm class 'hidden md:flex' 
                -> Ẩn hoàn toàn trên mobile, chỉ hiện flex trên PC 
            */}
            <Link 
                href={viewAll.link} 
                className="hidden md:flex col-span-2 md:col-span-2 group relative h-[300px] bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer flex-col items-center justify-center hover:border-brand-400 transition-all duration-500 hover:shadow-xl text-center p-4"
            >
                <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                    <ArrowRight size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-400 transition-colors">
                    {viewAll.text}
                </h3>
                <p className="text-base text-slate-500 mt-1 font-medium">
                    {viewAll.sub}
                </p>
            </Link>
        </div>

        {/* 3. PRODUCT GRID */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
            <span className="h-px bg-slate-200 flex-1"></span>
            <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {prodHeading}
            </span>
            <span className="h-px bg-slate-200 flex-1"></span>
        </div>
        
        {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-8">
                {products.map((product) => (
                    <div key={product.id} className="animate-fade-in">
                        <ProductCard 
                            product={product} 
                            onQuickAdd={() => addToCart(product)} 
                        />
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center text-slate-400 italic py-10 text-sm">
                Chưa có sản phẩm nào được chọn.
             </div>
        )}

        {/* 4. MOBILE VIEW ALL LINK 
            THAY ĐỔI QUAN TRỌNG: Chỉ hiện trên mobile (md:hidden)
            Nằm dưới cùng danh sách sản phẩm
        */}
        <div className="mt-8 text-center md:hidden">
            <Link 
                href={viewAll.link} 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 hover:border-slate-900 pb-1 transition-all"
            >
                {viewAll.text} <ArrowRight size={16} />
            </Link>
        </div>

      </div>
    </section>
  );
};