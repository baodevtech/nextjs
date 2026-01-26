'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Scissors } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductComponents';
import { useCart } from '@/context/CartContext';

interface AccessoriesSectionProps {
    products: Product[];
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({ products }) => {
  const { addToCart } = useCart();
  
  const accessoryProducts = useMemo(() => {
      // Giả lập lọc danh mục accessories
      return products.filter(p => p.categories.includes('accessories') || p.categories.includes('phu-kien') || p.name.includes('Phào')).slice(0, 4);
  }, [products]);

  return (
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
                        Chi Tiết. <span className="text-slate-400">Định Hình Đẳng Cấp.</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Hệ thống phụ kiện nẹp, phào chỉ và keo dán chuyên dụng được thiết kế đồng bộ để tạo nên sự hoàn hảo cho từng góc cạnh.
                    </p>
                </div>
                <Link href="/shop?cat=accessories" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 hover:border-slate-900 pb-1 transition-all">
                    Xem tất cả phụ kiện <ArrowRight size={16} />
                </Link>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {/* Nẹp Inox Card */}
                <div className="md:col-span-2 group relative h-[400px] bg-slate-50 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
                    <img src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop" alt="Nẹp Inox" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-2 inline-block">Luxury</span>
                        <h3 className="text-3xl font-bold mb-2 font-serif">Nẹp Trang Trí Inox 304</h3>
                        <p className="text-slate-200 mb-6 opacity-90 max-w-sm text-sm leading-relaxed">Mạ PVD vàng gương, không bay màu. Điểm nhấn sang trọng cho vách đá và lam sóng.</p>
                        <Link href="/shop?cat=accessories" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1 group-hover:text-amber-400 group-hover:border-amber-400 transition-colors">Xem bộ sưu tập <ArrowRight size={14} /></Link>
                    </div>
                </div>
                {/* Phào Chỉ & Keo (Giữ nguyên cấu trúc thẻ phụ) */}
                <div className="group relative h-[400px] bg-white rounded-3xl overflow-hidden cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <img src="https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" alt="Phào chỉ"/>
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                     <div className="absolute bottom-8 left-8 text-white">
                        <h3 className="text-xl font-bold mb-1">Phào Chỉ Hàn Quốc</h3>
                        <p className="text-sm text-slate-200 opacity-80">Tinh tế từng đường nét.</p>
                     </div>
                </div>
                
                {/* Keo */}
                <div className="group relative h-[300px] bg-slate-900 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                     <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity"><img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Keo"/></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                     <div className="absolute top-6 left-6"><Scissors className="text-white/50 w-8 h-8" /></div>
                     <div className="absolute bottom-8 left-8 text-white"><h3 className="text-xl font-bold mb-1">Keo Dán Chuyên Dụng</h3><p className="text-sm text-slate-300">Siêu dính, chịu nước, an toàn.</p></div>
                </div>

                {/* View All */}
                <Link href="/shop?cat=accessories" className="md:col-span-2 group relative h-[300px] bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer flex flex-col items-center justify-center hover:border-brand-500 transition-all duration-500 hover:shadow-xl">
                    <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500"><ArrowRight size={32} /></div>
                    <h3 className="text-2xl font-bold text-slate-900">Xem Tất Cả Phụ Kiện</h3>
                    <p className="text-slate-500 mt-2 font-medium">Hơn 50+ loại nẹp, phào và vật tư phụ trợ</p>
                </Link>
            </div>

            {/* Product Grid */}
            <div className="flex items-center gap-4 mb-8">
                <span className="h-px bg-slate-200 flex-1"></span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sản Phẩm Phổ Biến</span>
                <span className="h-px bg-slate-200 flex-1"></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {accessoryProducts.map((product) => (
                    <div key={product.id} className="animate-fade-in">
                        <ProductCard product={product} onQuickAdd={() => addToCart(product)} />
                    </div>
                ))}
            </div>
        </div>
      </section>
  );
};