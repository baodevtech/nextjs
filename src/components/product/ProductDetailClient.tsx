'use client';

import React, { useEffect, useState } from 'react';
import { 
    Minus, Plus, ShoppingCart, MessageCircle, Phone, 
    Check, Truck, ShieldCheck, Star, Maximize2, Layers, Box, Zap , X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/common/UI';
import { MaterialCalculator, AIAssistant } from '@/components/product/ProductComponents';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      setMounted(true);
  }, []);
  // Gộp ảnh đại diện và gallery thành 1 mảng để hiển thị
  const allImages = [product.image, ...(product.galleryImages || [])];

  const handleQuantityChange = (delta: number) => {
      setQuantity(prev => Math.max(1, prev + delta));
  };
  const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài làm đóng modal
      setActiveImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  // Tính toán % giảm giá
  const currentPrice = product.price.amount;
  const originalPrice = product.regularPrice?.amount || (currentPrice > 0 ? currentPrice * 1.1 : 0);
  
  const isDiscounted = originalPrice > currentPrice && currentPrice > 0;
  const discountPercent = isDiscounted 
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16 lg:gap-y-12">
      
      <div className="order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1">
        <div className="space-y-4">
           <div 
                className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group cursor-zoom-in"
                onClick={() => setIsModalOpen(true)}
            >
                <Image 
                    src={allImages[activeImage]?.sourceUrl || '/placeholder.jpg'} 
                    alt={allImages[activeImage]?.altText || product.name} 
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                {isDiscounted && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        -{discountPercent}% Giảm giá
                    </div>
                )}
            </div>
            
         <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {allImages.map((img, i) => (
                    <button 
                        key={i} 
                        onClick={() => setActiveImage(i)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? 'border-brand-500 shadow-md' : 'border-transparent hover:border-brand-200'}`}
                    >
                        <Image 
                            src={img.sourceUrl || '/placeholder.jpg'} 
                            alt={img.altText || 'Thumbnail'} 
                            fill
                            sizes="80px"
                            className="object-cover" 
                        />
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 relative">
         <div className="lg:sticky lg:top-24 space-y-6">
            
            <div>
                <div className="flex items-center justify-between mb-3">
                    {product.brand && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-1 rounded">{product.brand}</span>
                    )}
                    <span className="text-[10px] font-mono font-medium text-slate-400">SKU: {product.sku}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-snug">
                    {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm pb-4 border-b border-gray-100">
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
                    {/* SỬ DỤNG AMOUNT + UNIT THAY VÌ FORMATTED MẶC ĐỊNH */}
                    <span className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        {product.price.amount.toLocaleString('vi-VN')} <span className="text-lg md:text-xl"> {product.unit}</span>
                    </span>
                    {isDiscounted && (
                        <>
                            <span className="text-sm text-slate-400 line-through">
                                {product.regularPrice?.amount.toLocaleString('vi-VN') || originalPrice.toLocaleString('vi-VN')} {product.unit}
                            </span>
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">
                                -{discountPercent}%
                            </span>
                        </>
                    )}
                </div>
            </div>
           {product.shortDescription && (
                <div className="mt-6 bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 md:p-5 border border-slate-100/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        Tóm tắt sản phẩm
                    </h3>
                    <div 
                        className="prose prose-sm max-w-none text-[13px] md:text-[14px] text-slate-600 
                                   prose-p:my-1.5 prose-p:leading-relaxed 
                                   prose-strong:text-slate-800 prose-strong:font-semibold
                                   prose-ul:pl-4 prose-ul:my-2 
                                   prose-li:my-1 prose-li:marker:text-brand-500"
                        dangerouslySetInnerHTML={{ __html: product.shortDescription }} 
                    />
                </div>
            )}

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
                            <p className="text-sm font-bold text-green-700">{product.warranty} Tháng</p>
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
                        className="flex-1 h-12 text-sm uppercase tracking-wide font-bold shadow-brand-500/30 shadow-lg hover:-translate-y-0.5 transition-all px-2"
                    >
                        <ShoppingCart size={18} className="mr-1.5 md:mr-2"/>
                        <span className="truncate">{product.stockStatus === 'OUT_OF_STOCK' ? 'Hết Hàng' : 'Thêm Vào Giỏ'}</span>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <a 
                        href="https://zalo.me/0938692111" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center h-12 rounded-lg border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                    >
                       <div className="flex items-center gap-1.5 md:gap-2">
                            <MessageCircle size={18} className="group-hover:scale-110 transition-transform"/> 
                            <span className="font-bold text-xs md:text-sm">Chat Zalo</span>
                       </div>
                    </a>
                    <a 
                        href="tel:0938692111"
                        className="flex flex-col items-center justify-center h-12 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 transition-all group"
                    >
                       <div className="flex items-center gap-1.5 md:gap-2">
                            <Phone size={18} className="group-hover:rotate-12 transition-transform"/> 
                            <span className="font-bold text-xs md:text-sm">0938.692.111</span>
                       </div>
                    </a>
                </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-2 pt-2 border-t border-gray-50">
                <span className="flex items-center gap-1.5"><Check size={12} className="text-green-500"/> Đổi trả 7 ngày</span>
                <span className="flex items-center gap-1.5"><Truck size={12} className="text-brand-500"/> Ship toàn quốc</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-brand-500"/> Chính hãng 100%</span>
            </div>

         </div>
      </div>

      <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 space-y-10">
        
        {/* MÔ TẢ CHI TIẾT */}
        <div>
            <h2 className="font-bold text-xl md:text-2xl text-slate-900 mb-6 flex items-center gap-3">
                 Mô Tả Chi Tiết
                 <div className="h-px bg-gray-200 flex-1"></div>
            </h2>
            <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-headings:text-slate-900 prose-img:rounded-xl">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                   
            </div>
        </div>

        {/* BẢNG THÔNG SỐ */}
        <div className="bg-slate-50 rounded-2xl p-5 md:p-8 border border-gray-100">
             <h2 className="font-bold text-lg md:text-xl text-slate-900 mb-6">Thông Số Kỹ Thuật</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 md:gap-y-4 text-xs md:text-sm">
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Mã sản phẩm</span>
                    <span className="font-bold text-slate-900">{product.sku}</span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Thương hiệu</span>
                    <span className="font-bold text-slate-900">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Kích thước (D x R)</span>
                    <span className="font-bold text-slate-900">{product.dimensions.length} x {product.dimensions.width} mm</span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Độ dày</span>
                    <span className="font-bold text-slate-900">{product.dimensions.thickness} mm</span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Diện tích tấm</span>
                    <span className="font-bold text-slate-900">{product.dimensions.area} m²</span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Bảo hành</span>
                    <span className="font-bold text-slate-900">{product.warranty} Tháng</span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Bề mặt</span>
                    <span className="font-bold text-slate-900">{product.surface}</span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 border-dashed">
                    <span className="text-slate-500">Xuất xứ</span>
                    <span className="font-bold text-slate-900">{product.origin}</span>
                </div>
             </div>
        </div>

        {/* AI ASSISTANT */}
        <div className="border-t border-gray-100 pt-8">
             <AIAssistant product={product} />
        </div>
      </div>
              {/* CỬA SỔ PHÓNG TO ẢNH (MODAL) V2 */}
      {mounted && isModalOpen && createPortal(
        <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-md"
      // 1. BẤM VÀO NỀN ĐEN SẼ ĐÓNG MODAL
      onClick={() => setIsModalOpen(false)}
  >
            {/* Thanh công cụ phía trên */}
            <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50">
                {/* Bộ đếm ảnh */}
                <div className="text-white/80 font-medium bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm">
                    {activeImage + 1} / {allImages.length}
                </div>
                
                {/* Nút đóng */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-red-500/80 rounded-full p-2.5 transition-all backdrop-blur-md"
                    title="Đóng (Esc)"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Nút lùi */}
            {allImages.length > 1 && (
                <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all backdrop-blur-md z-50"
                >
                    <ChevronLeft size={32} />
                </button>
            )}

            {/* Khung chứa ảnh */}
           <div 
          className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 md:p-16 flex items-center justify-center" 
          // 2. CHẶN LẠI: NẾU BẤM VÀO VÙNG NÀY THÌ KHÔNG ĐÓNG
          onClick={(e) => e.stopPropagation()} 
      >
          <Image 
              src={allImages[activeImage]?.sourceUrl || '/placeholder.jpg'} 
              alt={allImages[activeImage]?.altText || product.name} 
              fill
              sizes="100vw"
              className="object-contain select-none" 
              priority
          />
      </div>

            {/* Nút tiến */}
            {allImages.length > 1 && (
                <button 
                    onClick={handleNextImage}
                    className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all backdrop-blur-md z-50"
                >
                    <ChevronRight size={32} />
                </button>
            )}
        </div>,
        document.body // Dòng này là điểm mấu chốt: Gắn trực tiếp vào thẻ body
      )}
    </div>
  );
}