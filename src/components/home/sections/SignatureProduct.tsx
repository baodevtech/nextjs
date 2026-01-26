'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductComponents';
import { useCart } from '@/context/CartContext';

interface SignatureProductProps {
  products: Product[];
}

export const SignatureProduct: React.FC<SignatureProductProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'premium'>('bestseller');
  const { addToCart } = useCart();

  const displayedProducts = useMemo(() => {
      let filtered = [];
      if (activeTab === 'new') filtered = [...products].reverse();
      else if (activeTab === 'premium') filtered = products.filter(p => p.price.amount > 200000);
      else filtered = products; 
      
      return filtered.slice(0, 8); // Giới hạn số lượng hiển thị
  }, [products, activeTab]);

  return (
    <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                    <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6">
                        Sự Tinh Tế. <span className="text-slate-400">Trong Từng Chi Tiết.</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                        Tuyển tập những mẫu tấm ốp Nano và Lam sóng mới nhất, được chế tác tỉ mỉ để tái định nghĩa không gian sống của bạn.
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
                    {[
                        { id: 'bestseller', label: 'Bán Chạy' },
                        { id: 'new', label: 'Mới Nhất' },
                        { id: 'premium', label: 'Cao Cấp' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {displayedProducts.map((product) => (
                    <div key={product.id} className="animate-fade-in">
                        <ProductCard product={product} onQuickAdd={() => addToCart(product)} />
                    </div>
                ))}
            </div>
            <div className="mt-20 text-center">
                <Link href="/shop" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-lg hover:underline decoration-2 underline-offset-4 group">
                    Xem toàn bộ bộ sưu tập <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    </section>
  );
};