'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Sparkles, Ruler, Star, ShoppingCart, Eye, Tag, Layers, Hash, RotateCcw, Info, Check } from 'lucide-react';
import { Product } from '@/types';
import Image from 'next/image';
import { askProductQuestion } from '@/services/geminiService';

export const ProductCard: React.FC<{ product: Product, onQuickAdd?: () => void }> = ({ product, onQuickAdd }) => {
  // Tính toán % giảm giá
  const currentPrice = product.price.amount;
  const originalPrice = product.regularPrice?.amount || (currentPrice > 0 ? currentPrice * 1.1 : 0);
  
  const isDiscounted = originalPrice > currentPrice && currentPrice > 0;
  const discountPercent = isDiscounted 
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
      : 0;

  return (
    <div className="group relative bg-white rounded-lg md:rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-brand-200 flex flex-col h-full">
      <div className="relative aspect-[4/4] overflow-hidden bg-gray-50 flex-shrink-0">
       <Link href={`/product/${product.slug}`}>
            <Image 
                src={product.image.sourceUrl || '/placeholder.jpg'} 
                alt={product.image.altText || product.name} 
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
        </Link>
        
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-2">
            {product.stockStatus === 'OUT_OF_STOCK' && (
                <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-slate-900 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wide rounded">Hết hàng</span>
            )}
            {isDiscounted && (
                <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-red-500 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wide rounded">-{discountPercent}%</span>
            )}
        </div>

        <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-1.5 md:gap-2">
            <button 
                onClick={(e) => { e.preventDefault(); onQuickAdd?.(); }}
                className="flex-1 bg-slate-900 text-white py-1.5 md:py-2.5 rounded md:rounded-lg text-[9px] md:text-xs font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-lg"
            >
                <ShoppingCart size={12} className="md:w-[14px] md:h-[14px]" /> Thêm
            </button>
            <Link 
                href={`/product/${product.slug}`}
                className="w-7 h-7 md:w-10 md:h-auto bg-white text-slate-900 rounded md:rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg border border-gray-100"
                title="Xem chi tiết"
            >
                <Eye size={14} className="md:w-[16px] md:h-[16px]" />
            </Link>
        </div>
      </div>
      
      <div className="p-2.5 md:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400 line-clamp-1 pr-1">{product.categories[0]}</span>
            <div className="flex gap-0.5 shrink-0">
                {[1,2,3,4,5].map(i => (
                    <Star key={i} size={8} className="md:w-[10px] md:h-[10px] fill-amber-400 text-amber-400" />
                ))}
            </div>
        </div>

        {product.brand && (
           <div className="text-[8px] md:text-[10px] text-brand-600 font-extrabold uppercase tracking-widest mb-0.5 md:mb-1 flex items-center gap-1">
             <Tag size={8} /> {product.brand}
           </div>
        )}

        <Link href={`/product/${product.slug}`} className="block mb-1.5 md:mb-2">
            <h3 className="text-[11px] md:text-sm font-bold text-slate-800 line-clamp-2 min-h-[32px] md:min-h-[40px] group-hover:text-brand-600 transition-colors leading-tight md:leading-normal">
            {product.name}
            </h3>
        </Link>

        <div className="flex items-center justify-between mb-2 md:mb-3 border-b border-dashed border-gray-100 pb-1.5 md:pb-2">
            <div className="flex items-center gap-1 text-slate-500 bg-slate-50 px-1 py-0.5 rounded border border-slate-100">
               <Hash size={8} className="md:w-[10px] md:h-[10px] text-slate-400"/>
               <span className="text-[8px] md:text-[10px] font-mono font-medium max-w-[50px] md:max-w-none truncate">{product.sku || 'N/A'}</span>
            </div>

            <div className={`flex items-center gap-1 md:gap-1.5 text-[8px] md:text-[10px] font-bold ${product.stockStatus === 'IN_STOCK' ? 'text-green-600' : 'text-orange-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
                {product.stockStatus === 'IN_STOCK' ? 'Sẵn kho' : 'Đặt trước'}
            </div>
        </div>

        {(product.dimensions.length > 0 || product.dimensions.width > 0) && (
          <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3">
             <div className="inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded bg-slate-50 border border-slate-100 text-[8px] md:text-[10px] font-medium text-slate-600" title="Kích thước (Rộng x Dài)">
                <Ruler size={8} className="md:w-[10px] md:h-[10px] mr-1 text-slate-400"/>
                {product.dimensions.width}x{product.dimensions.length}mm
             </div>
             {product.dimensions.thickness > 0 && (
               <div className="inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded bg-slate-50 border border-slate-100 text-[8px] md:text-[10px] font-medium text-slate-600" title="Độ dày">
                  <Layers size={8} className="md:w-[10px] md:h-[10px] mr-1 text-slate-400"/>
                  Dày {product.dimensions.thickness}mm
               </div>
             )}
          </div>
        )}
        
        <div className="flex items-baseline gap-1.5 md:gap-2 mt-auto pt-1.5 md:pt-2 border-t border-gray-50">
            {product.price.amount === 0 ? (
                <span className="text-[11px] md:text-sm font-bold text-brand-600">Liên hệ báo giá</span>
            ) : (
                <>
                    {/* SỬ DỤNG AMOUNT + UNIT THAY VÌ FORMATTED MẶC ĐỊNH */}
                    <span className="text-[13px] md:text-base font-bold text-slate-900">
                        {product.price.amount.toLocaleString('vi-VN')} {product.unit}
                    </span>
                    {isDiscounted && (
                        <span className="text-[8px] md:text-xs text-slate-400 line-through">
                            {product.regularPrice?.amount.toLocaleString('vi-VN') || originalPrice.toLocaleString('vi-VN')} {product.unit}
                        </span>
                    )}
                </>
            )}
            </div>
      </div>
    </div>
  );
};

export const MaterialCalculator: React.FC<{ product: Product, onAdd: (qty: number) => void, className?: string }> = ({ product, onAdd, className = '' }) => {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [result, setResult] = useState<{ 
      wallArea: number,
      wasteArea: number,
      totalArea: number,
      boxes: number,
      panelArea: number 
  } | null>(null);

  const calculate = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0 || !product.dimensions.area) return;

    const wallArea = w * h;
    const wasteArea = wallArea * (wastePercent / 100);
    const totalAreaNeeded = wallArea + wasteArea;
    const panelsNeeded = Math.ceil(totalAreaNeeded / product.dimensions.area);
    
    setResult({ 
        wallArea: parseFloat(wallArea.toFixed(2)),
        wasteArea: parseFloat(wasteArea.toFixed(2)),
        totalArea: parseFloat(totalAreaNeeded.toFixed(2)),
        boxes: panelsNeeded,
        panelArea: product.dimensions.area
    });
  };

  useEffect(() => {
    if (width && height) calculate();
  }, [width, height, wastePercent]);

  const reset = () => {
    setWidth('');
    setHeight('');
    setResult(null);
  }

  const wasteOptions = [
      { value: 5, label: '5%', desc: 'Ít cắt' },
      { value: 10, label: '10%', desc: 'Tiêu chuẩn' },
      { value: 15, label: '15%', desc: 'Nhiều cắt' }
  ];

  return (
    <div className={`bg-white border border-brand-200 rounded-lg md:rounded-xl overflow-hidden ${className}`}>
        <div className="bg-brand-50 p-2.5 md:p-4 border-b border-brand-100 flex justify-between items-center">
             <div className="flex items-center gap-1.5 md:gap-2 text-brand-800">
                <div className="p-1 md:p-1.5 bg-white rounded md:rounded-md shadow-sm text-brand-600">
                    <Calculator size={14} className="md:w-4 md:h-4" />
                </div>
                <div>
                    <span className="text-[11px] md:text-sm font-bold block">Dự Toán Chi Phí</span>
                </div>
             </div>
             {result && (
                <button onClick={reset} className="text-[9px] md:text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <RotateCcw size={10} className="md:w-3 md:h-3"/> Làm lại
                </button>
             )}
        </div>

        <div className="p-3 md:p-5 space-y-3 md:space-y-5">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="space-y-1 md:space-y-1.5">
                    <label className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rộng (m)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={width}
                            onChange={(e) => setWidth(e.target.value)} 
                            className="w-full h-8 md:h-10 pl-2.5 md:pl-3 pr-6 md:pr-8 bg-slate-50 border border-gray-200 rounded md:rounded-lg text-xs md:text-sm font-semibold focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                            placeholder="VD: 4.5"
                        />
                        <span className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-[10px] md:text-xs text-slate-400 font-bold">m</span>
                    </div>
                </div>
                <div className="space-y-1 md:space-y-1.5">
                    <label className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cao (m)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={height}
                            onChange={(e) => setHeight(e.target.value)} 
                            className="w-full h-8 md:h-10 pl-2.5 md:pl-3 pr-6 md:pr-8 bg-slate-50 border border-gray-200 rounded md:rounded-lg text-xs md:text-sm font-semibold focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                            placeholder="VD: 3.0"
                        />
                         <span className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-[10px] md:text-xs text-slate-400 font-bold">m</span>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
                <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                    <label className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Độ Hao Hụt</label>
                    <div className="group relative">
                        <Info size={10} className="md:w-3 md:h-3 text-slate-400 cursor-help"/>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 md:w-48 bg-slate-800 text-white text-[8px] md:text-[10px] p-2 rounded hidden group-hover:block z-10">
                            Hao hụt xảy ra khi cắt tấm ốp tại các góc tường, ổ điện hoặc cửa sổ.
                        </div>
                    </div>
                </div>
                <div className="flex gap-1.5 md:gap-2">
                    {wasteOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setWastePercent(opt.value)}
                            className={`flex-1 py-1.5 md:py-2 px-1 rounded md:rounded-lg border transition-all relative overflow-hidden ${
                                wastePercent === opt.value 
                                ? 'bg-brand-600 border-brand-600 text-white shadow-md' 
                                : 'bg-white border-gray-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50'
                            }`}
                        >
                            <span className="font-bold block text-[11px] md:text-sm">{opt.label}</span>
                            <span className={`text-[7px] md:text-[9px] block ${wastePercent === opt.value ? 'text-brand-100' : 'text-slate-400'}`}>{opt.desc}</span>
                            {wastePercent === opt.value && (
                                <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
                                    <Check size={8} className="md:w-[10px] md:h-[10px]" strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {result && (
                <div className="bg-slate-50 rounded-lg md:rounded-xl border border-dashed border-gray-300 p-2.5 md:p-4 space-y-2 md:space-y-3 animate-fade-in relative mt-4 md:mt-0">
                    <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-slate-50 border border-gray-300 text-slate-500 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                        Chi tiết tính toán
                    </div>
                    
                    <div className="space-y-1 md:space-y-2 text-[9px] md:text-xs text-slate-600 pb-2 md:pb-3 border-b border-gray-200 pt-1.5 md:pt-0">
                        <div className="flex justify-between">
                            <span>DT tường ({width}x{height}):</span>
                            <span className="font-medium">{result.wallArea} m²</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Hao hụt ({wastePercent}%):</span>
                            <span>+ {result.wasteArea} m²</span>
                        </div>
                         <div className="flex justify-between font-semibold text-slate-900">
                            <span>Tổng vật tư:</span>
                            <span>= {result.totalArea} m²</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] md:text-xs text-slate-500">
                         <span>DT 1 tấm:</span>
                         <span className="font-mono">{result.panelArea} m²</span>
                    </div>

                    <div className="pt-0.5 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase">Cần mua:</p>
                            <p className="text-[7px] md:text-[10px] text-slate-400">Làm tròn lên</p>
                        </div>
                        <div className="text-right">
                             <span className="text-lg md:text-2xl font-bold text-brand-600 block leading-none">{result.boxes} <span className="text-[10px] md:text-sm font-medium text-slate-500">Tấm</span></span>
                        </div>
                    </div>

                    <button 
                        onClick={() => onAdd(result.boxes)}
                        className="w-full mt-1 md:mt-2 py-1.5 md:py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded md:rounded-lg shadow-lg shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2"
                    >
                        <ShoppingCart size={12} className="md:w-3.5 md:h-3.5"/> Thêm {result.boxes} tấm
                    </button>
                </div>
            )}
            
            {!result && (
                <div className="text-center py-4 md:py-6 text-slate-400 text-[10px] md:text-xs italic bg-slate-50/50 rounded md:rounded-lg border border-dashed border-gray-200">
                    Nhập kích thước để xem chi tiết
                </div>
            )}
        </div>
    </div>
  );
};

export const AIAssistant: React.FC<{ product: Product, className?: string }> = ({ product, className = '' }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const res = await askProductQuestion(product, question);
    setAnswer(res);
    setLoading(false);
  };

  return (
    <div className={className}>
        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
            <Sparkles size={14} className="md:w-[18px] md:h-[18px] text-indigo-500" />
            <h3 className="font-bold text-slate-900 text-[11px] md:text-sm">Trợ Lý AI Tư Vấn</h3>
        </div>
        <div className="bg-indigo-50/50 rounded-lg md:rounded-xl p-2.5 md:p-4 border border-indigo-100">
             <div className="min-h-[40px] md:min-h-[60px] text-[10px] md:text-sm text-slate-600 mb-2 md:mb-3">
                {answer || "Tôi có thể giải đáp thắc mắc về thông số, cách thi công hoặc độ bền của sản phẩm này."}
             </div>
             <form onSubmit={handleAsk} className="relative">
                <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ví dụ: Loại này có chịu nước không?"
                className="w-full pr-8 md:pr-10 py-1.5 md:py-2 pl-2.5 md:pl-3 bg-white border-transparent focus:border-indigo-500 rounded md:rounded-lg text-[10px] md:text-sm shadow-sm"
                />
                <button type="submit" disabled={loading} className="absolute right-1 top-1 p-1 md:p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                    <ArrowRight size={12} className="md:w-4 md:h-4" />
                </button>
             </form>
        </div>
    </div>
  );
};