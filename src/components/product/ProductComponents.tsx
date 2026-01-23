'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Sparkles, Ruler, Star, ShoppingCart, Eye, Tag, Layers, Hash, RotateCcw, X, Info, Check, Maximize2, Zap, Box, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '../common/UI';
import { askProductQuestion } from '@/services/geminiService';

export const ProductCard: React.FC<{ product: Product, onQuickAdd?: () => void }> = ({ product, onQuickAdd }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-brand-200 flex flex-col h-full">
      <div className="relative aspect-[4/4] overflow-hidden bg-gray-50 flex-shrink-0">
        <Link href={`/product/${product.slug}`}>
            <img 
            src={product.image.sourceUrl} 
            alt={product.image.altText} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        </Link>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.stockStatus === 'OUT_OF_STOCK' && (
                <span className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wide rounded">Hết hàng</span>
            )}
            {product.price.amount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide rounded">-10%</span>
            )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <button 
                onClick={(e) => { e.preventDefault(); onQuickAdd?.(); }}
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
                <ShoppingCart size={14} /> Thêm Nhanh
            </button>
            <Link 
                href={`/product/${product.slug}`}
                className="w-10 bg-white text-slate-900 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg border border-gray-100"
                title="Xem chi tiết"
            >
                <Eye size={16} />
            </Link>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.categories[0]}</span>
            <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                ))}
            </div>
        </div>

        {product.brand && (
           <div className="text-[10px] text-brand-600 font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1">
             <Tag size={8} /> {product.brand}
           </div>
        )}

        <Link href={`/product/${product.slug}`} className="block mb-2">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-brand-600 transition-colors">
            {product.name}
            </h3>
        </Link>

        <div className="flex items-center justify-between mb-3 border-b border-dashed border-gray-100 pb-2">
            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
               <Hash size={10} className="text-slate-400"/>
               <span className="text-[10px] font-mono font-medium">{product.sku}</span>
            </div>

            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${product.stockStatus === 'IN_STOCK' ? 'text-green-600' : 'text-orange-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
                {product.stockStatus === 'IN_STOCK' ? 'Sẵn kho HN' : 'Đặt trước'}
            </div>
        </div>

        {(product.dimensions.length > 0 || product.dimensions.width > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
             <div className="inline-flex items-center px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600" title="Kích thước (Rộng x Dài)">
                <Ruler size={10} className="mr-1 text-slate-400"/>
                {product.dimensions.width} x {product.dimensions.length}mm
             </div>
             {product.dimensions.thickness > 0 && (
               <div className="inline-flex items-center px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600" title="Độ dày">
                  <Layers size={10} className="mr-1 text-slate-400"/>
                  Dày {product.dimensions.thickness}mm
               </div>
             )}
          </div>
        )}
        
        <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-gray-50">
           {product.price.amount === 0 ? (
               <span className="text-sm font-bold text-brand-600">Liên hệ báo giá</span>
           ) : (
               <>
                <span className="text-base font-bold text-slate-900">{product.price.formatted}</span>
                <span className="text-xs text-slate-400 line-through">{(product.price.amount * 1.1).toLocaleString('vi-VN')}₫</span>
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
      { value: 5, label: '5%', desc: 'Tường phẳng, ít cắt' },
      { value: 10, label: '10%', desc: 'Tiêu chuẩn' },
      { value: 15, label: '15%', desc: 'Nhiều cửa/cột' }
  ];

  return (
    <div className={`bg-white border border-brand-200 rounded-xl overflow-hidden ${className}`}>
        <div className="bg-brand-50 p-4 border-b border-brand-100 flex justify-between items-center">
             <div className="flex items-center gap-2 text-brand-800">
                <div className="p-1.5 bg-white rounded-md shadow-sm text-brand-600">
                    <Calculator size={16} />
                </div>
                <div>
                    <span className="text-sm font-bold block">Dự Toán Chi Phí</span>
                </div>
             </div>
             {result && (
                <button onClick={reset} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <RotateCcw size={12}/> Làm lại
                </button>
             )}
        </div>

        <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Chiều Rộng (m)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={width}
                            onChange={(e) => setWidth(e.target.value)} 
                            className="w-full h-10 pl-3 pr-8 bg-slate-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                            placeholder="VD: 4.5"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">m</span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Chiều Cao (m)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={height}
                            onChange={(e) => setHeight(e.target.value)} 
                            className="w-full h-10 pl-3 pr-8 bg-slate-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                            placeholder="VD: 3.0"
                        />
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">m</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Độ Hao Hụt (Cắt/Ghép)</label>
                    <div className="group relative">
                        <Info size={12} className="text-slate-400 cursor-help"/>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded hidden group-hover:block z-10">
                            Hao hụt xảy ra khi cắt tấm ốp tại các góc tường, ổ điện hoặc cửa sổ.
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {wasteOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setWastePercent(opt.value)}
                            className={`flex-1 py-2 px-1 rounded-lg border text-xs transition-all relative overflow-hidden ${
                                wastePercent === opt.value 
                                ? 'bg-brand-600 border-brand-600 text-white shadow-md' 
                                : 'bg-white border-gray-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50'
                            }`}
                        >
                            <span className="font-bold block text-sm">{opt.label}</span>
                            <span className={`text-[9px] block ${wastePercent === opt.value ? 'text-brand-100' : 'text-slate-400'}`}>{opt.desc}</span>
                            {wastePercent === opt.value && (
                                <div className="absolute top-1 right-1">
                                    <Check size={10} strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {result && (
                <div className="bg-slate-50 rounded-xl border border-dashed border-gray-300 p-4 space-y-3 animate-fade-in relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-50 border border-gray-300 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Chi tiết tính toán
                    </div>
                    
                    <div className="space-y-2 text-xs text-slate-600 pb-3 border-b border-gray-200">
                        <div className="flex justify-between">
                            <span>Diện tích tường ({width}x{height}m):</span>
                            <span className="font-medium">{result.wallArea} m²</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Cộng hao hụt ({wastePercent}%):</span>
                            <span>+ {result.wasteArea} m²</span>
                        </div>
                         <div className="flex justify-between font-semibold text-slate-900">
                            <span>Tổng diện tích vật tư:</span>
                            <span>= {result.totalArea} m²</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500">
                         <span>Diện tích 1 tấm:</span>
                         <span className="font-mono">{result.panelArea} m²</span>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Số lượng cần:</p>
                            <p className="text-[10px] text-slate-400">({result.totalArea} / {result.panelArea}) làm tròn lên</p>
                        </div>
                        <div className="text-right">
                             <span className="text-2xl font-bold text-brand-600 block leading-none">{result.boxes} <span className="text-sm font-medium text-slate-500">Tấm</span></span>
                        </div>
                    </div>

                    <button 
                        onClick={() => onAdd(result.boxes)}
                        className="w-full mt-2 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={14}/> Thêm {result.boxes} tấm vào giỏ
                    </button>
                </div>
            )}
            
            {!result && (
                <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50/50 rounded-lg border border-dashed border-gray-200">
                    Nhập kích thước để xem chi tiết vật tư
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
        <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-indigo-500" />
            <h3 className="font-bold text-slate-900 text-sm">Trợ Lý AI Tư Vấn</h3>
        </div>
        <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
             <div className="min-h-[60px] text-sm text-slate-600 mb-3">
                {answer || "Tôi có thể giải đáp thắc mắc về thông số, cách thi công hoặc độ bền của sản phẩm này."}
             </div>
             <form onSubmit={handleAsk} className="relative">
                <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ví dụ: Loại này có chịu nước không?"
                className="w-full pr-10 py-2 pl-3 bg-white border-transparent focus:border-indigo-500 rounded-lg text-sm shadow-sm"
                />
                <button type="submit" disabled={loading} className="absolute right-1 top-1 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                   <ArrowRight size={16} />
                </button>
             </form>
        </div>
    </div>
  );
};