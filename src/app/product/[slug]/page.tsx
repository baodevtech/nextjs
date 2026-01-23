'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ChevronRight, Ruler, Layers, ShieldCheck, Tag, Truck, 
    MessageCircle, Phone, Check, Minus, Plus, Info, Star, Box, Maximize2, ShoppingCart, Zap
} from 'lucide-react';
import { getProductBySlug } from '@/services/wpService';
import { Product } from '@/types';
import { Button } from '@/components/common/UI';
import { MaterialCalculator, AIAssistant } from '@/components/product/ProductComponents';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.slug) {
      getProductBySlug(params.slug).then(p => setProduct(p || null));
      setActiveImage(0);
      setQuantity(1);
    }
  }, [params.slug]);

  if (!product) return <div className="pt-32 text-center text-gray-500 min-h-screen">Đang tải sản phẩm...</div>;

  const allImages = [product.image, ...product.galleryImages];

  const handleQuantityChange = (delta: number) => {
      setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="bg-white min-h-screen font-sans animate-fade-in pb-20">
       <div className="border-b border-gray-100 bg-white sticky top-0 z-30 lg:relative">
          <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-slate-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
             <Link href="/" className="hover:text-brand-600 transition-colors">Trang chủ</Link>
             <ChevronRight size={12} className="text-slate-300" />
             <Link href="/shop" className="hover:text-brand-600 transition-colors">Sản phẩm</Link>
             <ChevronRight size={12} className="text-slate-300" />
             <span className="text-slate-900 font-medium truncate">{product.name}</span>
          </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div className="space-y-4">
                <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group cursor-zoom-in">
                    <img 
                        src={allImages[activeImage]?.sourceUrl} 
                        alt={allImages[activeImage]?.altText} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {product.price.amount > 0 && (
                         <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            -10% Giảm giá
                         </div>
                    )}
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {allImages.map((img, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveImage(i)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? 'border-brand-600 ring-2 ring-brand-100 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'}`}
                        >
                            <img src={img.sourceUrl} alt={img.altText} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="font-serif font-bold text-2xl text-slate-900 mb-6 flex items-center gap-3">
                         Mô Tả Chi Tiết
                         <div className="h-px bg-gray-200 flex-1"></div>
                    </h2>
                    <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-img:rounded-xl">
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            {!product.description && (
                                <p className="text-slate-500 italic">
                                    Đang cập nhật mô tả chi tiết cho sản phẩm này...
                                </p>
                            )}
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                     <h2 className="font-serif font-bold text-xl text-slate-900 mb-6">Thông Số Kỹ Thuật</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Mã sản phẩm</span>
                            <span className="font-bold text-slate-900">{product.sku}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Thương hiệu</span>
                            <span className="font-bold text-slate-900">{product.brand}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Kích thước (D x R)</span>
                            <span className="font-bold text-slate-900">{product.dimensions.length} x {product.dimensions.width} mm</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Độ dày</span>
                            <span className="font-bold text-slate-900">{product.dimensions.thickness} mm</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Diện tích tấm</span>
                            <span className="font-bold text-slate-900">{product.dimensions.area} m²</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Bảo hành</span>
                            <span className="font-bold text-slate-900">15 Năm</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Bề mặt</span>
                            <span className="font-bold text-slate-900">Phủ Nano / Vân nổi</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-slate-500">Xuất xứ</span>
                            <span className="font-bold text-slate-900">Việt Nam</span>
                        </div>
                     </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                     <AIAssistant product={product} />
                </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
             <div className="lg:sticky lg:top-24 space-y-6">
                
                <div>
                    <div className="flex items-center justify-between mb-3">
                        {product.brand && (
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-1 rounded">{product.brand}</span>
                        )}
                        <span className="text-[10px] font-mono font-medium text-slate-400">SKU: {product.sku}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3 leading-snug">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm pb-4 border-b border-gray-100">
                        <div className="flex text-amber-400 gap-0.5">
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-slate-400 text-xs">(24 đánh giá)</span>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${product.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-600' : 'bg-orange-600'}`}></div>
                            {product.stockStatus === 'IN_STOCK' ? 'Còn hàng' : 'Liên hệ đặt trước'}
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Giá bán lẻ đề xuất:</p>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            {product.price.formatted}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                            {(product.price.amount * 1.1).toLocaleString('vi-VN')}₫
                        </span>
                        {product.price.amount > 0 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">-10%</span>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Zap size={12} className="text-amber-500"/> Thông số nổi bật
                    </p>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                                <Maximize2 size={16}/>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500">Kích thước</p>
                                <p className="text-sm font-bold text-slate-900">{product.dimensions.width}x{product.dimensions.length} <span className="text-[10px] font-normal">mm</span></p>
                            </div>
                         </div>
                         
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                                <Layers size={16}/>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500">Độ dày</p>
                                <p className="text-sm font-bold text-slate-900">{product.dimensions.thickness} <span className="text-[10px] font-normal">mm</span></p>
                            </div>
                         </div>

                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                                <Box size={16}/>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500">Diện tích</p>
                                <p className="text-sm font-bold text-slate-900">{product.dimensions.area} <span className="text-[10px] font-normal">m²/tấm</span></p>
                            </div>
                         </div>

                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                <ShieldCheck size={16}/>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500">Bảo hành</p>
                                <p className="text-sm font-bold text-green-700">15 Năm</p>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="bg-brand-50/50 rounded-lg border border-brand-100 overflow-hidden">
                    <MaterialCalculator product={product} onAdd={(qty) => {
                        setQuantity(qty);
                        addToCart(product, qty);
                    }} />
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg h-12 w-28 shrink-0 bg-white">
                            <button onClick={() => handleQuantityChange(-1)} className="w-9 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-gray-50 rounded-l-lg transition-colors">
                                <Minus size={16} />
                            </button>
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-900 border-x border-gray-100 text-sm">
                                {quantity}
                            </div>
                            <button onClick={() => handleQuantityChange(1)} className="w-9 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-gray-50 rounded-r-lg transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                        
                        <Button 
                            onClick={() => addToCart(product, quantity)}
                            disabled={product.stockStatus === 'OUT_OF_STOCK'}
                            className="flex-1 h-12 text-sm uppercase tracking-wide font-bold shadow-brand-500/30 shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            <ShoppingCart size={18} className="mr-2"/>
                            {product.stockStatus === 'OUT_OF_STOCK' ? 'Hết Hàng' : 'Thêm Vào Giỏ'}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a 
                            href="https://zalo.me/0912345678" 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex flex-col items-center justify-center h-12 rounded-lg border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                        >
                           <div className="flex items-center gap-2">
                                <MessageCircle size={18} className="group-hover:scale-110 transition-transform"/> 
                                <span className="font-bold text-sm">Chat Zalo</span>
                           </div>
                        </a>
                        <a 
                            href="tel:0912345678"
                            className="flex flex-col items-center justify-center h-12 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 transition-all group"
                        >
                           <div className="flex items-center gap-2">
                                <Phone size={18} className="group-hover:rotate-12 transition-transform"/> 
                                <span className="font-bold text-sm">0912.345.678</span>
                           </div>
                        </a>
                    </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 border-t border-gray-50">
                    <span className="flex items-center gap-1.5"><Check size={12} className="text-green-500"/> Đổi trả 7 ngày</span>
                    <span className="flex items-center gap-1.5"><Truck size={12} className="text-brand-500"/> Ship toàn quốc</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-brand-500"/> Chính hãng 100%</span>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};