'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Scissors } from 'lucide-react';
import { Product, AccessoryHighlight } from '@/types';
import { ProductCard } from '@/components/product/ProductComponents';
import { useCart } from '@/context/CartContext';

interface AccessoriesSectionProps {
  settings?: {
    headNormal?: string;      // <-- Thêm dòng này
    headHighlight?: string;   // <-- Thêm dòng này
    phuKienSub?: string;      // <-- Thêm dòng này
    highlights: AccessoryHighlight[]; // Mảng chứa 3 thẻ: [0]=Lớn, [1]=Nhỏ 1, [2]=Nhỏ 2
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
  const phuKienSub = settings?.phuKienSub || ' Hệ thống phụ kiện nẹp, phào chỉ và keo dán chuyên dụng được thiết kế đồng bộ để tạo nên sự hoàn hảo cho từng góc cạnh.';
  const highlights = settings?.highlights || [];
  const viewAll = settings?.viewAll || { text: 'Xem Tất Cả Phụ Kiện', sub: 'Hơn 50+ loại...', link: '/shop' };
  const prodHeading = settings?.prodHeading || 'SẢN PHẨM PHỔ BIẾN';
  const products = settings?.products || [];

  // Lấy ra từng thẻ highlight theo thứ tự để render đúng vị trí
  // [0]: Thẻ Lớn (Nẹp Inox)
  // [1]: Thẻ Nhỏ 1 (Phào Chỉ)
  // [2]: Thẻ Nhỏ 2 (Keo Dán)
  const cardLarge = highlights[0] || { title: 'Nẹp Trang Trí', subtitle: 'Mô tả...', image: '', link: '#' };
  const cardSmall1 = highlights[1] || { title: 'Phào Chỉ', subtitle: 'Mô tả...', image: '', link: '#' };
  const cardSmall2 = highlights[2] || { title: 'Keo Dán', subtitle: 'Mô tả...', image: '', link: '#' };

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. HEADER SECTION (Tiêu đề + Mô tả + Nút Xem) */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
                    {headNormal} <span className="text-slate-400">{headHighlight}</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                    {phuKienSub}
                </p>
            </div>
            <Link 
                href={viewAll.link} 
                className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 hover:border-slate-900 pb-1 transition-all whitespace-nowrap"
            >
                Xem tất cả phụ kiện <ArrowRight size={16} />
            </Link>
        </div>

        {/* 2. BENTO GRID (Bố cục Highlight) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            {/* [A] Card Lớn (Nẹp Inox - Col Span 2) */}
            <Link href={cardLarge.link} className="md:col-span-2 group relative h-[400px] bg-slate-50 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 block">
                <img 
                    src={cardLarge.image || 'https://via.placeholder.com/800x600'} 
                    alt={cardLarge.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 text-white">
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-2 inline-block">Luxury</span>
                    <h3 className="text-3xl font-bold mb-2 font-serif">{cardLarge.title}</h3>
                    <p className="text-slate-200 mb-6 opacity-90 max-w-sm text-sm leading-relaxed line-clamp-2">
                        {cardLarge.subtitle}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1 group-hover:text-amber-400 group-hover:border-amber-400 transition-colors">
                        Xem bộ sưu tập <ArrowRight size={14} />
                    </span>
                </div>
            </Link>

            {/* [B] Card Nhỏ 1 (Phào Chỉ - Col Span 1) */}
            <Link href={cardSmall1.link} className="group relative h-[400px] bg-white rounded-3xl overflow-hidden cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 block">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <img 
                        src={cardSmall1.image || 'https://via.placeholder.com/400x600'} 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" 
                        alt={cardSmall1.title}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-xl font-bold mb-1">{cardSmall1.title}</h3>
                    <p className="text-sm text-slate-200 opacity-80 line-clamp-2">{cardSmall1.subtitle}</p>
                </div>
            </Link>
            
            {/* [C] Card Nhỏ 2 (Keo Dán - Col Span 1) */}
            <Link href={cardSmall2.link} className="group relative h-[300px] bg-slate-900 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 block">
                <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity">
                    <img 
                        src={cardSmall2.image || 'https://via.placeholder.com/400x300'} 
                        className="w-full h-full object-cover" 
                        alt={cardSmall2.title}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-6 left-6">
                    <Scissors className="text-white/50 w-8 h-8" />
                </div>
                <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-xl font-bold mb-1">{cardSmall2.title}</h3>
                    <p className="text-sm text-slate-300 line-clamp-2">{cardSmall2.subtitle}</p>
                </div>
            </Link>

            {/* [D] Card Xem Tất Cả (Col Span 2) */}
            <Link 
                href={viewAll.link} 
                className="md:col-span-2 group relative h-[300px] bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer flex flex-col items-center justify-center hover:border-brand-400 transition-all duration-500 hover:shadow-xl block"
            >
                <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500"><ArrowRight size={32} /></div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-400 transition-colors">
                    {viewAll.text}
                </h3>
                <p className="text-slate-500 mt-2 font-medium">
                    {viewAll.sub}
                </p>
            </Link>
        </div>

        {/* 3. PRODUCT GRID (Danh sách sản phẩm phổ biến) */}
        <div className="flex items-center gap-4 mb-8">
            <span className="h-px bg-slate-200 flex-1"></span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                {prodHeading}
            </span>
            <span className="h-px bg-slate-200 flex-1"></span>
        </div>
        
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
             <div className="text-center text-slate-400 italic py-10">
                Chưa có sản phẩm nào được chọn.
             </div>
        )}

      </div>
    </section>
  );
};