// src/components/home/ProductShowcase.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductComponents';
import { Button } from '@/components/common/UI';
import { useCart } from '@/context/CartContext';

interface ProductShowcaseProps {
  initialProducts: Product[];
  categories: Category[];
}

export const ProductShowcase = ({ initialProducts, categories }: ProductShowcaseProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const { addToCart } = useCart();

  // Logic lọc sản phẩm dựa trên tab đang chọn
  const displayedProducts = activeTab === 'all' 
    ? initialProducts 
    : initialProducts.filter(p => p.categories.includes(activeTab));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header của Section & Tabs lọc */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl  font-bold text-slate-900 mb-2">Sản Phẩm Tiêu Biểu</h2>
            <p className="text-slate-500 font-sans font-light">Những mẫu bán chạy nhất được KTS khuyên dùng.</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar mt-6 md:mt-0 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'}`}
            >
              Tất cả
            </button>
            {categories.slice(0, 3).map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.slug)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === cat.slug ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fade-in min-h-[400px]">
          {displayedProducts.length > 0 ? (
            displayedProducts.slice(0, 8).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickAdd={() => addToCart(product)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <Sparkles size={48} className="mb-4 opacity-20"/>
              <p>Đang cập nhật bộ sưu tập mới.</p>
            </div>
          )}
        </div>
        
        {/* Nút xem thêm */}
        <div className="mt-16 text-center">
          <Link href="/shop">
            <Button variant="outline" className="px-12 py-4 h-auto text-xs font-bold uppercase tracking-widest border border-slate-200 hover:border-slate-900 hover:bg-white text-slate-900 rounded-sm transition-all">
              Vào Cửa Hàng
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};